import fs from 'fs'
import path from 'path'


export async function generateImage() {
  const imagePath =  path.join(__dirname, 'ball.gif')
  console.log(imagePath)

  const buffer = fs.readFileSync(imagePath)

  // Convert Buffer to ArrayBuffer
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  )
}

// Example usage:
/*
const fs = require('fs');

async function example() {
  const text = "Hello, this is a test of converting text to an image using Node.js and the canvas library. This text should wrap to multiple lines if it's long enough.";
  
  try {
    const arrayBuffer = await generateImage(text, {
      width: 600,
      height: 400,
      fontSize: 24,
      backgroundColor: '#f0f0f0',
      fontColor: '#333333'
    });
    
    // Convert ArrayBuffer back to Buffer to save to file (for testing)
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync('output.png', buffer);
    console.log('Image created successfully!');
  } catch (error) {
    console.error('Error creating image:', error);
  }
}

example();
*/
