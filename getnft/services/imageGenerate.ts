import { createCanvas, CanvasRenderingContext2D, loadImage } from 'canvas'
import path from 'path'
type TextToImageOptions = {
  width?: number
  height?: number
  fontFamily?: string
  fontSize?: number
  fontColor?: string
  backgroundColor?: string
  format?: string
  quality?: number
  padding?: number
  imageMaxWidth?: number
  imageMaxHeight?: number
}

export async function generateImage(options: TextToImageOptions) {
  const imagePath =  path.join(__dirname, 'ball.png')
  console.log(imagePath)

  // Set default options
  const config = {
    width: options.width || 400,
    height: options.height || 400,
    fontFamily: options.fontFamily || 'Arial',
    fontSize: options.fontSize || 30,
    fontColor: options.fontColor || 'black',
    backgroundColor: options.backgroundColor || 'white',
    format: options.format || 'png',
    quality: options.quality || 0.92,
    padding: options.padding || 20,
    imageMaxWidth: options.imageMaxWidth || 350,
    imageMaxHeight: options.imageMaxHeight || 350,
  }

  // Create canvas with the specified dimensions
  const canvas = createCanvas(config.width, config.height)
  const ctx = canvas.getContext('2d')

  // Set background
  ctx.fillStyle = config.backgroundColor
  ctx.fillRect(0, 0, config.width, config.height)

  // Draw crystal ball
  let image;
  try {
    image = await loadImage(imagePath);
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to load image`);
  }

  const imageAspectRatio = image.width / image.height;
  let renderWidth = image.width;
  let renderHeight = image.height;
  
  if (renderWidth > config.imageMaxWidth) {
    renderWidth = config.imageMaxWidth;
    renderHeight = renderWidth / imageAspectRatio;
  }
  
  if (renderHeight > config.imageMaxHeight) {
    renderHeight = config.imageMaxHeight;
    renderWidth = renderHeight * imageAspectRatio;
  }
  
  // Calculate position to center the image
  const imageX = (config.width - renderWidth) / 2;
  const imageY = (config.height - renderHeight) / 2; 
  
  // Draw the image in the center
  ctx.drawImage(image, imageX, imageY, renderWidth, renderHeight);

  // Convert canvas to buffer
  const format = config.format.toLowerCase()
  let buffer

  if (format === 'jpeg' || format === 'jpg') {
    buffer = canvas.toBuffer('image/jpeg', { quality: config.quality })
  } else {
    // Default to PNG
    buffer = canvas.toBuffer('image/png')
  }

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
