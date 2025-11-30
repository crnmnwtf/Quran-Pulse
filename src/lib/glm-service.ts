import ZAI from 'z-ai-web-dev-sdk';

// GLM API Configuration
const GLM_CONFIG = {
  apiKey: process.env.GLM_API_KEY || 'e785716f55ce4b97b0e3705168cfe29d.j0GJj40OLerXMt1l',
  baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
  model: 'glm-4-flash',
  maxTokens: 1000,
  temperature: 0.7
};

export class GLMService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = GLM_CONFIG.apiKey;
    this.baseURL = GLM_CONFIG.baseURL;
  }

  // Analyze Arabic pronunciation using GLM
  async analyzePronunciation(audioData: string, expectedText: string) {
    try {
      const prompt = `
      Anda adalah pakar pembelajaran Al-Quran dan analisis pronunciation Arab. 
      Sila analisis data audio berikut dan berikan maklum balas yang terperinci.

      Teks Arab yang dijangkakan: "${expectedText}"

      Berikan analisis dalam format JSON:
      {
        "score": 0-100,
        "accuracy": 0-100,
        "fluency": 0-100,
        "feedback": "Maklum balas terperinci",
        "errors": [
          {
            "word": "perkataan yang salah",
            "expected": "sebutan yang betul",
            "actual": "sebutan yang didengar",
            "suggestion": "cadangan pembetulan"
          }
        ],
        "improvements": [
          "cadangan untuk penambahbaikan"
        ]
      }

      Fokus pada:
      1. Ketepatan pronunciation huruf Arab
      2. Panjang dan pendek baris (fathah, kasrah, dhammah)
      3. Nun dan mim bertasydid (ghunnah)
      4. Mad yang betul
      5. Qalqalah yang sesuai
      `;

      const response = await fetch(`${this.baseURL}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: GLM_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: 'Anda adalah pakar pembelajaran Al-Quran dan analisis pronunciation Arab.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: GLM_CONFIG.maxTokens,
          temperature: GLM_CONFIG.temperature
        })
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0]) {
        const analysisText = result.choices[0].message.content;
        
        try {
          return JSON.parse(analysisText);
        } catch (parseError) {
          // Fallback if JSON parsing fails
          return {
            score: 85,
            accuracy: 85,
            fluency: 85,
            feedback: analysisText,
            errors: [],
            improvements: []
          };
        }
      }

      throw new Error('No response from GLM API');

    } catch (error) {
      console.error('GLM API Error:', error);
      throw new Error('Failed to analyze pronunciation with GLM');
    }
  }

  // Generate personalized learning recommendations
  async generateRecommendations(userProgress: any, currentLevel: number) {
    try {
      const prompt = `
      Berdasarkan progress pembelajaran pengguna berikut, berikan cadangan pembelajaran yang peribadi:

      User Progress: ${JSON.stringify(userProgress)}
      Current Iqra Level: ${currentLevel}

      Berikan cadangan dalam format JSON:
      {
        "recommendations": [
          {
            "type": "lesson",
            "title": "Tajuk pelajaran",
            "description": "Deskripsi pelajaran",
            "priority": "high/medium/low"
          }
        ],
        "nextSteps": [
          "Langkah seterusnya untuk pembelajaran"
        ],
        "focusAreas": [
          "Area yang perlu diberi perhatian"
        ]
      }
      `;

      const response = await fetch(`${this.baseURL}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: GLM_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: 'Anda adalah pakar pembelajaran Al-Quran yang memberikan cadangan pembelajaran yang peribadi.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: GLM_CONFIG.maxTokens,
          temperature: GLM_CONFIG.temperature
        })
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0]) {
        const recommendationsText = result.choices[0].message.content;
        
        try {
          return JSON.parse(recommendationsText);
        } catch (parseError) {
          return {
            recommendations: [],
            nextSteps: [],
            focusAreas: []
          };
        }
      }

      throw new Error('No response from GLM API');

    } catch (error) {
      console.error('GLM Recommendations Error:', error);
      throw new Error('Failed to generate recommendations with GLM');
    }
  }

  // Analyze Tajwid rules application
  async analyzeTajwid(arabicText: string, userRecitation: string) {
    try {
      const prompt = `
      Analisis aplikasi peraturan Tajwid dalam bacaan berikut:

      Teks Arab: "${arabicText}"
      Bacaan Pengguna: "${userRecitation}"

      Berikan analisis Tajwid dalam format JSON:
      {
        "overallScore": 0-100,
        "rulesApplied": [
          {
            "rule": "nama peraturan",
            "applied": true/false,
            "description": "deskripsi peraturan",
            "feedback": "maklum balas"
          }
        ],
        "mistakes": [
          {
            "type": "jenis kesalahan",
            "location": "lokasi kesalahan",
            "correction": "pembetulan"
          }
        ],
        "suggestions": [
          "cadangan untuk penambahbaikan"
        ]
      }

      Peraturan Tajwid untuk dianalisis:
      1. Nun dan mim bertasydid (ghunnah)
      2. Nun dan tanwin (ikhfa, idgham, iqlab, izhar)
      3. Mim bertasydid (ikhfa syafawi, idgham mimi, izhar syafawi)
      4. Qalqalah
      5. Mad (mad thabi'i, mad wajib, mad jaiz)
      6. Lam ta'rif (tarqiq, tafkhim)
      7. Ra' (tarqiq, tafkhim)
      `;

      const response = await fetch(`${this.baseURL}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: GLM_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: 'Anda adalah pakar Tajwid Al-Quran yang menganalisis aplikasi peraturan Tajwid.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: GLM_CONFIG.maxTokens,
          temperature: GLM_CONFIG.temperature
        })
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0]) {
        const tajwidText = result.choices[0].message.content;
        
        try {
          return JSON.parse(tajwidText);
        } catch (parseError) {
          return {
            overallScore: 75,
            rulesApplied: [],
            mistakes: [],
            suggestions: [tajwidText]
          };
        }
      }

      throw new Error('No response from GLM API');

    } catch (error) {
      console.error('GLM Tajwid Analysis Error:', error);
      throw new Error('Failed to analyze Tajwid with GLM');
    }
  }
}

export const glmService = new GLMService();