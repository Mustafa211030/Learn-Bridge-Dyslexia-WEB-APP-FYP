// import { Html, Head, Main, NextScript } from 'next/document'

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         {/* <link 
//   href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" 
//   rel="stylesheet" 
// /> */}
        
//       </Head>
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }











// // pages/_document.js
// // Custom Document for Next.js - Proper place for Google Fonts and global head tags

// import { Html, Head, Main, NextScript } from 'next/document';

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head>
//         {/* Google Fonts - This is the correct place for stylesheets */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800;900&display=swap"
//           rel="stylesheet"
//         />
        
//         {/* Favicon */}
//         <link rel="icon" href="/favicon.ico" />
        
//         {/* Meta tags */}
//         <meta name="description" content="LearnBridge Dyslexia - Educational platform for children with dyslexia" />
//         <meta name="theme-color" content="#4F46E5" />
//       </Head>
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   );
// }




































// pages/_document.js
// Custom Document for Next.js - Proper place for Google Fonts and global head tags

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts - This is the correct place for stylesheets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Meta tags */}
        <meta name="description" content="LearnBridge Dyslexia - Educational platform for children with dyslexia" />
        <meta name="theme-color" content="#4F46E5" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}