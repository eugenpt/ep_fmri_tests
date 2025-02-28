// code to be pasted on the form result page of https://psytests.org/emo/panasen.html to get my-formatted json

function customFormatter(obj) {
    function formatValue(value, indent = '') {
        if (Array.isArray(value)) {
            const items = value.map(item => formatValue(item, indent)).join(', ');
            return `[${items}]`;
        }
        if (typeof value === 'object' && value !== null) {
            const nextIndent = indent + '  ';
            const items = Object.entries(value).map(([key, val]) => 
                `${nextIndent}"${key}": ${formatValue(val, nextIndent)}`
            ).join(',\n');
            return `{\n${items}\n${indent}}`;
        }
        if (typeof value === 'string') return `"${value}"`;
        return value;
    }
    return formatValue(obj);
}

function parsePANAS() {
    // Get the HTML content
    const htmlContent = document.getElementsByClassName('blD')[0].outerHTML;
    
    // Create a DOM parser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Get all question elements
    const questionElements = doc.getElementsByClassName('blQ');
    const panasResponses = [];
    
    // Positive and Negative affect items based on PANAS scale
    const positiveItems = ['Interested', 'Excited', 'Strong', 'Enthusiastic', 'Proud', 
                         'Alert', 'Inspired', 'Determined', 'Attentive', 'Active'];
    const negativeItems = ['Distressed', 'Upset', 'Guilty', 'Scared', 'Hostile', 
                         'Irritable', 'Ashamed', 'Nervous', 'Jittery', 'Afraid'];
    
    let positiveSum = 0;
    let negativeSum = 0;
    
    // Process each question
    Array.from(questionElements).forEach((questionEl, index) => {
        const questionText = questionEl.textContent.trim();
        const questionNum = index + 1;
        
        // Get the answer elements for this question (next 5 elements after question)
        const answerElements = [
            doc.getElementById(`q${questionNum}a1`),
            doc.getElementById(`q${questionNum}a2`),
            doc.getElementById(`q${questionNum}a3`),
            doc.getElementById(`q${questionNum}a4`),
            doc.getElementById(`q${questionNum}a5`)
        ];
        
        // Find the selected value (where ✓ is present)
        let value = 0;
        answerElements.forEach((el, idx) => {
            if (el && el.textContent === '✓') {
                value = idx + 1;
            }
        });
        
        // Add to responses array as [question, value]
        panasResponses.push([questionText, value]);
        
        // Add to appropriate sum
        if (positiveItems.includes(questionText)) {
            positiveSum += value;
        } else if (negativeItems.includes(questionText)) {
            negativeSum += value;
        }
    });
    
    // Calculate averages (divide by number of items: 10 for each scale)
    const panasPositiveScore = (positiveSum / 10).toFixed(2);
    const panasNegativeScore = (negativeSum / 10).toFixed(2);
    
    // Create result object
    const result = {
        test_type: "PANAS",
        panasResponses,
        panasPositiveScore,
        panasNegativeScore
    };
    
    return result;
}

// Execute and log the result
const panasResult = parsePANAS();
console.log(customFormatter(panasResult));