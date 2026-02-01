# Voice Input Feature - User Guide

## Overview
Your Quality Monitoring System now has a fully functional **Voice Input** feature that allows you to add medicines by speaking instead of typing manually.

## How to Use Voice Input

### 1. **Access the Feature**
   - Navigate to: `http://localhost:3000/items`
   - Locate the "Add New Medicine" section
   - You'll see a purple **"Voice Input"** button with a microphone icon 🎤

### 2. **Using Voice Input**
   
   **Step 1: Click the Voice Input Button**
   - Click on the "Voice Input" button
   - The button will change to show "Listening..." with a pulsing indicator
   - The browser will ask for microphone permission (allow it)

   **Step 2: Speak Your Medicine Details**
   - Speak clearly in the following format:
     ```
     "Medicine [Medicine Name] batch [Batch Number]"
     ```
   
   **Examples:**
   - "Medicine Paracetamol batch A123"
   - "Add medicine Aspirin batch B456"
   - "Medicine Amoxicillin batch C789"

   **Step 3: Voice Input Stops Automatically**
   - The system will automatically stop listening after 5 seconds of silence
   - Or you can click the button again to stop manually

   **Step 4: Review the Captured Data**
   - The transcript appears below the button showing what you said
   - Medicine Name and Batch Number fields will auto-populate
   - A success message appears: "Voice input captured: Medicine: [Name], Batch: [Number]"

   **Step 5: Select Quality Status Manually**
   - Use the dropdown to select: **Accepted** or **Rejected**
   - This is done manually (not via voice)

   **Step 6: Submit the Form**
   - Click the "Add Medicine" button to save

## Voice Command Patterns

The voice parser understands various natural language patterns:

### Medicine Name
- "Medicine Paracetamol"
- "Add medicine Aspirin"
- "Medicine Vitamin C"

### Batch Number
- "batch A123"
- "batch number B456"
- "batch XY789"

### Combined Examples
✅ **Working Examples:**
- "Medicine Paracetamol batch A123"
- "Add medicine Aspirin batch number B456"
- "Medicine Amoxicillin batch C789 status approved"
- "Medicine Ibuprofen batch D012"

## Advanced Features

### Optional Voice Fields (if needed in future)
The voice parser also supports (currently not displayed in form):
- **Temperature**: "temperature 25" or "temp 30.5"
- **Humidity**: "humidity 60"
- **Quality Status**: "approved", "rejected", "pending"
- **Expiry Date**: "expiry 2026-12-31"
- **Quantity**: "quantity 100"
- **Manufacturer**: "manufacturer Pfizer"

### Example with all fields:
```
"Medicine Paracetamol batch A123 temperature 25 humidity 60 approved"
```

## Browser Compatibility

✅ **Supported Browsers:**
- Google Chrome (Recommended)
- Microsoft Edge
- Safari (with some limitations)

❌ **Not Supported:**
- Firefox (Web Speech API limitations)
- Internet Explorer

If your browser doesn't support voice input, you'll see:
> ⚠️ Voice input not supported in this browser. Try Chrome or Edge.

## Troubleshooting

### Voice Input Not Working?

1. **Check Microphone Permission**
   - Browser must have microphone access
   - Check browser settings → Site permissions → Microphone

2. **No Response After Speaking**
   - Speak clearly and loudly
   - Ensure background noise is minimal
   - Wait for the "Listening..." indicator

3. **Fields Not Auto-Filling**
   - Check the transcript below the button
   - Make sure you're using the correct format: "Medicine [Name] batch [Number]"
   - Try speaking more slowly and clearly

4. **Transcript Shows Wrong Words**
   - This is a speech recognition issue
   - Speak more clearly
   - Try again with better pronunciation
   - You can always manually edit the fields after

## Tips for Best Results

1. **Speak Clearly**: Pronounce medicine names clearly
2. **Use Keywords**: Always say "medicine" before the name and "batch" before the number
3. **Quiet Environment**: Reduce background noise for better accuracy
4. **Short Pauses**: Pause briefly between medicine name and batch number
5. **Manual Override**: You can always type or edit the fields manually after voice input

## Technical Details

- **Voice Recognition**: Uses Web Speech API (react-speech-recognition)
- **Auto-Stop**: Listening stops after 5 seconds of silence
- **Language**: English (US) - "en-US"
- **Continuous Mode**: Captures full sentence before processing

## Current Workflow

1. **Click** "Voice Input" button
2. **Speak**: "Medicine [Name] batch [Number]"
3. **Wait**: System processes and fills Medicine Name & Batch Number
4. **Select**: Choose Quality Status from dropdown (Accepted/Rejected)
5. **Submit**: Click "Add Medicine" button

---

**Need Help?**
- Make sure your Django backend is running on `http://localhost:8000`
- Check browser console (F12) for any errors
- Verify you're logged in with a valid access token
