/**
 * Voice Command Parser for Medicine CRUD Operations
 * Parses natural language voice input into structured medicine data
 */

/**
 * Parse voice transcript to extract medicine data
 * @param {string} transcript - Voice recognition transcript
 * @returns {object} - Parsed medicine data object
 */
export const parseVoiceCommand = (transcript) => {
  if (!transcript) return {};
  
  const data = {};
  const lower = transcript.toLowerCase();
  
  // Parse medicine name (after "medicine" or "add" keywords)
  // Examples: "add medicine Paracetamol", "medicine Aspirin"
  const medicineMatch = lower.match(/(?:add\s+)?medicine\s+([a-zA-Z0-9\s]+?)(?:\s+batch|\s+temp|\s+humidity|\s+expiry|\s+status|$)/i);
  if (medicineMatch) {
    data.medicine_name = medicineMatch[1].trim();
  }
  
  // Parse batch number
  // Examples: "batch A123", "batch number B456"
  const batchMatch = lower.match(/batch\s+(?:number\s+)?([a-z0-9]+)/i);
  if (batchMatch) {
    data.batch_number = batchMatch[1].toUpperCase();
  }
  
  // Parse temperature
  // Examples: "temp 25", "temperature 30.5"
  const tempMatch = lower.match(/temp(?:erature)?\s+(\d+\.?\d*)/i);
  if (tempMatch) {
    data.temperature = parseFloat(tempMatch[1]);
  }
  
  // Parse humidity
  // Examples: "humidity 60", "humidity 50.5"
  const humidityMatch = lower.match(/humidity\s+(\d+\.?\d*)/i);
  if (humidityMatch) {
    data.humidity = parseFloat(humidityMatch[1]);
  }
  
  // Parse expiry date
  // Examples: "expiry 2026-12-31", "expires 2026/12/31"
  const expiryMatch = lower.match(/expir(?:y|es)?\s+(\d{4}[-/]\d{2}[-/]\d{2})/i);
  if (expiryMatch) {
    data.expiry_date = expiryMatch[1].replace(/\//g, '-');
  }
  
  // Parse manufacturing date
  // Examples: "manufactured 2026-01-01", "mfg date 2026/01/01"
  const mfgMatch = lower.match(/(?:manufactured|mfg(?:\s+date)?)\s+(\d{4}[-/]\d{2}[-/]\d{2})/i);
  if (mfgMatch) {
    data.manufacturing_date = mfgMatch[1].replace(/\//g, '-');
  }
  
  // Parse quality status
  // Examples: "status approved", "rejected", "pending"
  if (lower.includes('approved') || lower.includes('accept') || lower.includes('pass')) {
    data.quality_status = 'Accepted';
  } else if (lower.includes('rejected') || lower.includes('reject') || lower.includes('fail')) {
    data.quality_status = 'Rejected';
  } else if (lower.includes('pending') || lower.includes('review')) {
    data.quality_status = 'Pending';
  }
  
  // Parse quantity
  // Examples: "quantity 100", "qty 500"
  const quantityMatch = lower.match(/(?:quantity|qty)\s+(\d+)/i);
  if (quantityMatch) {
    data.quantity = parseInt(quantityMatch[1]);
  }
  
  // Parse manufacturer name
  // Examples: "manufacturer Pfizer", "made by Johnson"
  const manufacturerMatch = lower.match(/(?:manufacturer|made\s+by)\s+([a-zA-Z0-9\s]+?)(?:\s+batch|\s+temp|$)/i);
  if (manufacturerMatch) {
    data.manufacturer = manufacturerMatch[1].trim();
  }
  
  return data;
};

/**
 * Parse voice command for action intent (add/update/delete)
 * @param {string} transcript - Voice recognition transcript
 * @returns {string} - Action type: 'add', 'update', 'delete', or null
 */
export const parseActionIntent = (transcript) => {
  if (!transcript) return null;
  
  const lower = transcript.toLowerCase();
  
  if (lower.includes('add') || lower.includes('create') || lower.includes('new')) {
    return 'add';
  } else if (lower.includes('update') || lower.includes('edit') || lower.includes('modify') || lower.includes('change')) {
    return 'update';
  } else if (lower.includes('delete') || lower.includes('remove')) {
    return 'delete';
  }
  
  return null;
};

/**
 * Format parsed data for display
 * @param {object} data - Parsed medicine data
 * @returns {string} - Formatted summary string
 */
export const formatParsedData = (data) => {
  const fields = [];
  
  if (data.medicine_name) fields.push(`Medicine: ${data.medicine_name}`);
  if (data.batch_number) fields.push(`Batch: ${data.batch_number}`);
  if (data.temperature) fields.push(`Temperature: ${data.temperature}°C`);
  if (data.humidity) fields.push(`Humidity: ${data.humidity}%`);
  if (data.quality_status) fields.push(`Status: ${data.quality_status}`);
  if (data.quantity) fields.push(`Quantity: ${data.quantity}`);
  if (data.expiry_date) fields.push(`Expiry: ${data.expiry_date}`);
  
  return fields.length > 0 ? fields.join(', ') : 'No data recognized';
};
