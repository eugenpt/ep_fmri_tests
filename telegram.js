function telegramAPI(method, data){
  if (typeof CHAT_ID !== 'undefined' && CHAT_ID && typeof BOT_TOKEN !== 'undefined' && BOT_TOKEN) {
    
  } else {
    return
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

  return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error while ${method}! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // You can process the data here if needed
        if(data.ok){
            return data.result;
        } else {
            console.log(data);
            throw new Error(`Telegram NOT OK while ${method}!`);
        }
    })
    .catch(error => {
        console.error(`Fetch error while ${method}:`, error);
        throw error; // Rethrow the error if needed
    });
}



function splitMessage(msg, limit=3500){
    const parts = [];
    let currentPart = '';
    const lines = msg.split('\n');

    for (let line of lines) {
        if (currentPart.length + line.length + 1 <= limit) {
            // Add the line to the current part
            currentPart += (currentPart ? '\n' : '') + line;
        } else {
            // Push the current part to the parts array and start a new part
            parts.push(currentPart);
            currentPart = line;
        }
    }

    // Push the last part
    if (currentPart) {
        parts.push(currentPart);
    }

    // Send each part with the part number and total number of parts appended
    const totalParts = parts.length;
    parts.forEach((part, index) => {
        const partNumber = index + 1;
        parts[index] = `${part}\n[${partNumber}/${totalParts}]`;
        
    });
    return parts;
}


function escapeMarkdownV2(text) {
  const specialChars = ['.', '-', '+', '[', ']', '#', '>', '_', '{', '}'];
  specialChars.forEach(char => {
    text = text.replaceAll(char, `\\${char}`);
  });
  return text;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



_D_PARTS = null;
_LAST_TG_MSG = null;

function ensureJSONString(value) {
    if (typeof value === 'string') {
        console.log("The value is already a string:", value);
        return value; // It's already a string, so return it.
    } else {
        try {
            const jsonString = JSON.stringify(value);
            console.log("Converted to JSON string:", jsonString);
            return jsonString; // Convert the value to a JSON string.
        } catch (error) {
            console.error("Failed to convert value to JSON string:", error);
            return null; // Handle conversion errors gracefully.
        }
    }
}

function prepHash(hash){
    return (hash[0]=='#'?'':'#') + hash.replaceAll(/[^#a-zA-Z0-9]/g,'_')
}

function prepHashs(hashs){
   if (hashs.length==1){
        return prepHash(hashs[0])+' ';
    } else {
        return '['+hashs.map(s=>prepHash(s)).join(' ')+']\n';
    }
}

function sendMessage(msg, hashs){
  msg = ensureJSONString(msg);
  if(msg==null){
    return
  }

  if(hashs==null){
    hashs = ['ep_js']
  }

  if(msg.length>3950){
    _D_PARTS = splitMessage(msg, 3850);
    for(var part of _D_PARTS){
        sendMessage(part, hashs);
        sleep(1000);
    }

    return
  }

  var text = prepHashs(hashs) + msg;
  text = escapeMarkdownV2(text);

  return telegramAPI('sendMessage',{
    chat_id: CHAT_ID,
    parse_mode: 'MarkdownV2',
    text: text
  }).then( (result) => {
    return result;
  })
}