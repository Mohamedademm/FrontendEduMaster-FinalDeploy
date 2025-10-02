// CertificateTemplate.js
import React from 'react';

const CertificateTemplate = ({ name, domain, level, date, signature, logoUrl }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Montserrat:wght@400;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .certificate-wrapper-preview { /* For use within the admin page preview/grid */
          font-family: 'Montserrat', sans-serif;
          background-color: #f4f7fc; /* Light background for the wrapper */
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 15px; /* Reduced padding for grid view */
          width: 100%;
          height: auto; /* Adjust height as needed for grid */
          min-height: 300px; /* Minimum height for consistency in grid */
          box-sizing: border-box;
        }
        
        .certificate-preview {
            background: white;
            width: 100%; /* Make it responsive within its container */
            max-width: 450px; /* Max width for grid view */
            aspect-ratio: 1.414 / 1; /* A4-like ratio, or use 4/3 */
            padding: 20px; /* Reduced padding */
            border: 1px solid #e0e0e0;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 0.8em; /* Scale down fonts for preview */
        }
        
        /* Styles for the standalone certificate page (when opened in new window) */
        body.certificate-standalone-body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            margin:0;
        }

        .certificate-standalone {
            background: white;
            width: 800px; /* A4-like width */
            height: 565px; /* A4-like height */
            max-width: 90vw;
            aspect-ratio: 1.414 / 1; /* A4 Landscape ratio for print */
            position: relative;
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            border-radius: 12px;
            overflow: hidden;
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .certificate-header {
            text-align: center;
            margin-bottom: 20px; /* Reduced for preview */
        }

        .certificate-standalone .certificate-header {
             margin-bottom: 30px;
        }
        
        .org-logo {
            max-width: 120px;
            margin-bottom: 15px;
        }
        .certificate-preview .org-logo {
            max-width: 80px;
            margin-bottom: 10px;
        }

        .certificate-title {
            font-family: 'Merriweather', serif;
            font-size: 2em; /* Scaled */
            color: #2c3e50;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .certificate-preview .certificate-title {
            font-size: 1.4em; /* Smaller for preview */
        }

        .certificate-subtitle {
            font-size: 1em; /* Scaled */
            color: #7f8c8d;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .certificate-preview .certificate-subtitle {
            font-size: 0.8em;
            letter-spacing: 1px;
        }
        
        .certificate-body {
            text-align: center;
            margin: 20px 0; /* Scaled */
            flex-grow: 1;
        }
        .certificate-standalone .certificate-body {
            margin: 30px 0;
        }

        .presented-to {
            font-size: 0.9em; /* Scaled */
            color: #34495e;
            margin-bottom: 10px; /* Scaled */
        }
        .certificate-preview .presented-to {
             font-size: 0.75em;
             margin-bottom: 5px;
        }

        .recipient-name {
            font-family: 'Merriweather', serif;
            font-size: 2.2em; /* Scaled */
            color: #2980b9; /* A nice blue */
            font-weight: 700;
            margin-bottom: 15px; /* Scaled */
            word-break: break-word;
        }
        .certificate-preview .recipient-name {
            font-size: 1.5em;
            margin-bottom: 10px;
        }
        
        .achievement-text {
            font-size: 0.9em; /* Scaled */
            color: #34495e;
            line-height: 1.6;
            max-width: 90%;
            margin: 0 auto 20px; /* Scaled */
        }
        .certificate-preview .achievement-text {
            font-size: 0.75em;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        .achievement-text strong {
            color: #2c3e50;
        }
        
        .certificate-footer {
            display: flex;
            justify-content: space-around; /* Space between date and signature */
            align-items: flex-end;
            margin-top: 25px; /* Scaled */
            padding-top: 15px; /* Scaled */
            border-top: 1px solid #bdc3c7;
            flex-wrap: wrap;
            gap: 15px;
        }
        .certificate-standalone .certificate-footer {
            margin-top: 40px;
            padding-top: 25px;
        }
        
        .footer-section {
            text-align: center;
            min-width: 150px; /* For standalone */
        }
        .certificate-preview .footer-section {
            min-width: 100px; /* For preview */
            font-size:0.9em;
        }
        
        .footer-line {
            width: 80%;
            max-width: 180px; /* For standalone */
            height: 1px;
            background-color: #7f8c8d;
            margin: 0 auto 8px;
        }
        .certificate-preview .footer-line {
            max-width: 120px;
        }
        
        .footer-label {
            font-size: 0.75em; /* Scaled */
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
         .certificate-preview .footer-label {
            font-size: 0.7em;
         }
        
        .footer-value {
            font-size: 0.9em; /* Scaled */
            color: #2c3e50;
            font-weight: 600;
        }
        .certificate-preview .footer-value {
             font-size: 0.8em;
        }

        /* Decorative Border Elements (Subtle) */
        .certificate-standalone::before, .certificate-standalone::after {
            content: '';
            position: absolute;
            z-index: -1;
            border-radius: 12px; /* Match parent */
        }
        .certificate-standalone::before { /* Subtle inner border */
            top: 15px; left: 15px; right: 15px; bottom: 15px;
            border: 2px solid #e0eafc;
        }
         /* Optional: Add a subtle pattern or watermark if desired */
        .certificate-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 5em; /* Scaled */
            color: rgba(44, 62, 80, 0.05);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
            text-transform: uppercase;
        }
         .certificate-preview .certificate-watermark {
            font-size: 3em;
         }


        @media print {
            body.certificate-standalone-body {
                background: white;
                margin: 0;
                padding: 0;
            }
            .certificate-standalone {
                box-shadow: none;
                border-radius: 0;
                width: 100%;
                height: 100vh; /* Adjust for print if needed */
                border: 1px solid #ccc; /* Simple border for print */
                padding: 30mm 20mm; /* Standard A4 margins */
            }
            .certificate-standalone::before, .certificate-standalone::after {
                display: none; /* Hide decorative borders for print if they cause issues */
            }
            .certificate-watermark {
                 color: rgba(44, 62, 80, 0.08); /* Slightly more visible for print */
            }
        }
      }`}
      </style>
      {/* We use a conditional class on the wrapper to apply different styles 
        depending on whether it's a preview or a standalone page.
        This example shows the structure for the standalone page.
        In certifications.js, you'll wrap this with <div className="certificate-wrapper-preview"> 
        and use <div className="certificate-preview">.
      */}
      <div className={logoUrl === "PREVIEW_MODE" ? "certificate-preview" : "certificate-standalone"}>
        {/* Watermark (Optional) - could be your organization's acronym or a symbol */}
        <div className="certificate-watermark">{domain ? domain.substring(0,3) : "CERT"}</div>

        <div className="certificate-content" style={{position: 'relative', zIndex: 1}}>
            <header className="certificate-header">
              {/* You can add a logo here */}
              {/* <img src={logoUrl || "/placeholder-logo.png"} alt="Organization Logo" className="org-logo" /> */}
              <h1 className="certificate-title">Certificate of Achievement</h1>
              <p className="certificate-subtitle">This Certificate is Proudly Presented To</p>
            </header>

            <main className="certificate-body">
              <p className="presented-to">This certifies that</p>
              <h2 className="recipient-name">{name || '[Recipient Name]'}</h2>
              <p className="achievement-text">
                has successfully completed all the requirements and has demonstrated outstanding proficiency in <br />
                <strong>{domain || '[Domain of Study/Achievement]'}</strong> at the <strong>{level || '[Level Achieved]'}</strong> level.
                This recognition is awarded on this day in acknowledgment of their dedication, hard work, and excellence.
              </p>
            </main>

            <footer className="certificate-footer">
              <div className="footer-section">
                <div className="footer-line"></div>
                <p className="footer-value">{date || new Date().toLocaleDateString()}</p>
                <p className="footer-label">Date of Issuance</p>
              </div>
              <div className="footer-section">
                <div className="footer-line"></div>
                <p className="footer-value">{signature || '[Authorized Signature]'}</p>
                <p className="footer-label">Authorized Signature</p>
              </div>
            </footer>
        </div>
      </div>
    </>
  );
};

export default CertificateTemplate;