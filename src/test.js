// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();

// Wait for the serial port to open.
await port.open({ baudRate: 57600 });



const writer = port.writable.getWriter();

// const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
const data = new Uint8Array([1, 2, 3, 4, 111]); // hello

await writer.write(data);


// Allow the serial port to be closed later.
writer.releaseLock();
