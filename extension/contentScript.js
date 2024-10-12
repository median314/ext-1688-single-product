/* eslint-disable no-unused-vars */
// Fungsi untuk menyuntikkan elemen div ke dalam halaman
function functionToInject() {
  var div = document.createElement('div');
  div.id = 'extension';
  document.body.appendChild(div);
}
functionToInject();

// Override fungsi xhr bawaan
const { XMLHttpRequest: originalXHR } = window;
console.log('running script...')

async function fetchHTML(url) {
  try {
    // Fetch the HTML content of the page
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    });

    if (response.ok) {
      // Get the response text (HTML content)
      const htmlContent = await response.text();
      console.log(htmlContent); // Log the HTML content
        const parser = new DOMParser();
        if(htmlContent?.includes('window.__GLOBAL_DADA')){
          // Parse the HTML string into a document object
          const doc = parser.parseFromString(htmlContent, 'text/html');
          
          // Get all <script> tags
          const scriptTags = doc.querySelectorAll('script');
  
          if(scriptTags){
            let targetScript = null;
            scriptTags.forEach((script) => {
              if (script.textContent.includes('window.__GLOBAL_DADA')) {
                targetScript = script.textContent.split('window.__INIT_DATA=')[1];
              }
            });
            
            if (targetScript) {
              console.log('Found Script:', JSON.parse(targetScript)); // This will log the content of the script with window.__GLOBAL_DADA
              localStorage.setItem('interceptedArr', JSON.stringify(JSON.parse(targetScript)))
            } else {
              console.log('No script tag with window.__GLOBAL_DADA found.');
            }
          }
        }

        //get all of the html code content of currrent page
        const getDataDescription = document.documentElement?.outerHTML
        const htmlParsing = parser.parseFromString(getDataDescription, 'text/html');

        // Get the element with the id 'detailContentContainer'
        const getDescription = htmlParsing.getElementById('detailContentContainer');
        console.log(getDescription.outerHTML, 'this is the description data') // Get all the inner HTML of the element

        // Check if the element exists
        if (getDescription) { 
          const dataDescription = {
            data: `<div>${getDescription.outerHTML}</div>`
          }
          // Save the inner HTML in localStorage
          localStorage.setItem('detailContent', JSON.stringify(dataDescription));
          console.log('Data saved to localStorage');
        } else {
          console.log('Element with id "detailContentContainer" not found');
        }

      return htmlContent;
    } else {
      console.error(`Failed to fetch HTML. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching the HTML:', error);
  }
}

async function fetchXHR() {
  var url = window.location.href, xmlhttp; //Remember, same domain

  if("XMLHttpRequest" in window) xmlhttp = new XMLHttpRequest();
  
  console.log(xmlhttp, 'this is xhr req');

  // eslint-disable-next-line no-undef
  if("ActiveXObject" in window) xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  xmlhttp.open('GET',url,true);
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) { 
        console.log(xmlhttp.responseText, 'testing xhr html nya');
      }
  };
  xmlhttp.send(null);
}

// Example usage
fetchHTML(window.location.href); 