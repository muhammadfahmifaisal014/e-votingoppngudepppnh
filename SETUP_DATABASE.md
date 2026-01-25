# Panduan Integrasi Google Sheets

Untuk menghubungkan aplikasi ini dengan Google Sheets untuk Validasi Token dan Penyimpanan Suara, ikuti langkah berikut:

## 1. Persiapkan Google Sheet

Buat Google Sheet baru dengan 2 Tab (Sheet):

**Sheet 1 Name: `Tokens`**
Isi kolom baris pertama (Header):
- `A1`: `Token`
- `B1`: `Status`
- `C1`: `Name`
- `D1`: `Class`
- `E1`: `Role` (Values: `PUTRA`, `PUTRI`, `GURU`)

Masukkan data contoh:
- `A2`: `TOKEN123` | `B2`: `ACTIVE` | `C2`: `Santri 1` | `D2`: `12 IPA` | `E2`: `PUTRA`
- `A3`: `TOKEN456` | `B3`: `USED`   | `C3`: `Santri 2` | `D3`: `12 IPS` | `E3`: `PUTRI`

**Sheet 2 Name: `Votes`**
Isi kolom baris pertama (Header):
- `A1`: `Timestamp`
- `B1`: `Token`
- `C1`: `Vote_0` (OPPN Putra)
- `D1`: `Vote_1` (OPPN Putri)
- `E1`: `Vote_2` (GUDEP)

## 2. Buat Google Apps Script

Di Google Sheet, klik `Extensions` > `Apps Script`.
Hapus kode yang ada, dan paste kode berikut:

```javascript
// --- CONFIGURATION ---
var SHEET_TOKENS = "Tokens";
var SHEET_VOTES = "Votes";

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // CORS Header for browser access
  var output = ContentService.createTextOutput();
  
  try {
    var params = e.parameter;
    
    // Handle POST body
    if (e.postData && e.postData.contents) {
      try {
        var body = JSON.parse(e.postData.contents);
        for (var key in body) {
          params[key] = body[key];
        }
      } catch (err) {}
    }
    
    var action = params.action;
    
    if (action == "verify") {
       return verifyToken(params.token);
    } 
    else if (action == "vote") {
       return submitVote(params.token, params.votes);
    } 
    else if (action == "results") {
       return getResults();
    }
    
    return jsonResponse({ valid: false, message: "Invalid Action" });
    
  } catch (err) {
    return jsonResponse({ valid: false, success: false, message: "Script Error: " + err.toString() });
  }
}

function verifyToken(token) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_TOKENS);
  var data = sheet.getDataRange().getValues();
  var inputToken = String(token).trim();
  
  // Skip Header (Row 1)
  for (var i = 1; i < data.length; i++) {
    var rowToken = String(data[i][0]).trim();
    var status = String(data[i][1]).trim().toUpperCase();
    
    if (rowToken === inputToken) {
      if (status === "ACTIVE") {
        return jsonResponse({ 
          valid: true, 
          message: "Valid",
          studentName: data[i][2],
          studentClass: data[i][3],
          role: data[i][4] 
        });
      } else {
        return jsonResponse({ valid: false, message: "Token sudah digunakan." });
      }
    }
  }
  
  return jsonResponse({ valid: false, message: "Token tidak ditemukan." });
}

function submitVote(token, votesData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetTokens = ss.getSheetByName(SHEET_TOKENS);
  var sheetVotes = ss.getSheetByName(SHEET_VOTES);
  var inputToken = String(token).trim();
  
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
     return jsonResponse({ success: false, message: "Server busy, try again." });
  }
  
  try {
    // 1. Re-verify Token and Get Row Index
    var tokenRow = -1;
    var data = sheetTokens.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === inputToken) {
        if (String(data[i][1]).trim().toUpperCase() === "USED") {
           return jsonResponse({ success: false, message: "Token sudah digunakan!" });
        }
        tokenRow = i + 1; // 1-based index (Header is row 1)
        break;
      }
    }
    
    if (tokenRow === -1) {
       return jsonResponse({ success: false, message: "Token invalid saat submit." });
    }
    
    // 2. Parse Votes
    var votes = (typeof votesData === 'string') ? JSON.parse(votesData) : votesData;
    
    // 3. Save Vote to Votes Sheet
    // Appends: [Date, Token, Vote_0, Vote_1, Vote_2]
    sheetVotes.appendRow([
      new Date(),
      inputToken,
      String(votes["0"] || "-"), // OPPN Putra
      String(votes["1"] || "-"), // OPPN Putri
      String(votes["2"] || "-")  // GUDEP
    ]);
    
    // 4. Update Token Status to USED
    sheetTokens.getRange(tokenRow, 2).setValue("USED");
    
    // 5. Force write to disk immediately
    SpreadsheetApp.flush();
    
    return jsonResponse({ success: true, message: "Suara berhasil disimpan." });
    
  } catch (err) {
    return jsonResponse({ success: false, message: "Error: " + err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function getResults() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_VOTES);
  var data = sheet.getDataRange().getValues();
  
  var counts = {};
  
  // Skip Header (Row 1)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // Votes are in columns C(2), D(3), E(4)
    var votes = [row[2], row[3], row[4]];
    
    votes.forEach(function(vote) {
       // Convert to string and trim to handle numbers/text mixing
       var candidateId = String(vote).trim();
       
       // Handle "3" vs "03" by stripping leading zeros for consistent keys if needed, 
       // but here we just store what we see. Frontend handles normalization.
       // Filter invalid values
       if (candidateId && candidateId !== "-" && candidateId !== "" && candidateId !== "undefined") {
         if (!counts[candidateId]) counts[candidateId] = 0;
         counts[candidateId]++;
       }
    });
  }
  
  return jsonResponse({
    success: true,
    results: counts,
    totalVotes: data.length - 1 
  });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy Script

1. Klik tombol **Deploy** > **New Deployment**.
2. Pilih type: **Web app**.
3. Configuration:
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` (Penting agar React App bisa akses).
4. Klik **Deploy**.
5. Salin **Web App URL** (yang berakhiran `/exec`).

## 4. Konfigurasi React App

Buat file `.env.local` di root folder project (sejajar dengan package.json) dan paste URL tadi:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
```

(Ganti `XXXXX` dengan ID script anda)

Restart aplikasi (matikan terminal dan jalankan `npm run dev` lagi) agar env variable terbaca.
