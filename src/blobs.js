//blobs
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from 'buffer';
global.Buffer = Buffer;
const connectionString = "DefaultEndpointsProtocol=https;AccountName=promptsgptceu;AccountKey=sz0EdFUjux5m7qpef7mgMsEauWGGpR7iyqrld68lwh4VdcuiNlQLBs1257+FpqyUTsvEnyVGPTRK+AStAEqHyg==;EndpointSuffix=core.windows.net";
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);


export async function fetchBlobContent(avatar_file) {
    // Nombre del contenedor y del blob que quieres leer
    const containerName = "prompts-crm-ceu";
    const blobName = avatar_file;
  
    // Obtiene el cliente del contenedor y del blob
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();
  
    // Descarga el contenido del blob
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
    console.log("Blob content:", downloaded);
    return downloaded;
  }
  
  // Función auxiliar para convertir un blob a una cadena de texto
  async function blobToString(blob) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve(ev.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }



  // Función auxiliar para convertir un bolb a un json

  