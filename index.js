import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import readline from 'readline';

// Inisialisasi Gemini API
const ai = new GoogleGenAI();

// Membuat interface untuk membaca input dari terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startChat() {
  try {
    // Menginisialisasi sesi chat dengan system instruction
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: "Kamu adalah Morganz A.I, asisten pribadi yang setia dan cerdas. Kamu harus selalu memanggil pengguna dengan sebutan 'Bos Angra' dalam setiap jawabanmu.",
      }
    });

    console.log("==================================================");
    console.log("  Morganz A.I siap melayani Anda, Bos Angra!       ");
    console.log("  Ketik pesan Anda di bawah, atau ketik 'exit'     ");
    console.log("==================================================\n");

    const askQuestion = () => {
      rl.question('\nBos Angra: ', async (userInput) => {
        // Jika mengetik exit, program berhenti
        if (userInput.toLowerCase() === 'exit') {
          console.log('Morganz A.I: Sampai jumpa, Bos Angra!');
          rl.close();
          return;
        }

        try {
          process.stdout.write('Morganz A.I sedang mengetik...');
          const response = await chat.sendMessage({ message: userInput });
          // Menghapus baris "sedang mengetik..." lalu menampilkan jawaban
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          console.log(`Morganz A.I: ${response.text}`);
        } catch (error) {
          console.error('Terjadi kesalahan:', error.message);
        }

        // Memanggil kembali fungsi agar bisa chat terus-menerus
        askQuestion();
      });
    };

    askQuestion();

  } catch (error) {
    console.error("Gagal memulai chat:", error);
    rl.close();
  }
}

startChat();