export const enviarScript = async (scriptText) => {
    const lines = scriptText.split(/[\n\t]+/).map(line => line.trim()).filter(line => line);
    const main = document.querySelector("#main");
    const textarea = main.querySelector(`div[contenteditable="true"]`);
    
    if (!textarea) throw new Error("cannot get the element");
    
    for (const line of lines) {
      
      textarea.focus();
      document.execCommand('insertText', false, line);
      textarea.dispatchEvent(new Event('change', {bubbles: true}));
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Tunggu sebelum mengklik tombol kirim
      
      (main.querySelector(`[data-testid="send"]`) || main.querySelector(`[data-icon="send"]`)).click();
      
      if (lines.indexOf(line) !== lines.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
    
    return lines.length;
  }