import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// export const metadata: Metadata = {
//     title: "Password Generator",
//     description: "Generate unique passwords",
//     openGraph: {
//         images: ["https://midasai.vercel.app/favicon.ico"]
//     }
// };

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <title>Непокор.мк - Непокорот е слобода!</title>
            <meta name="description"
                  content="Најголем избор на македонски патриотски производи на едно место. Од македонски знамиња, македонски дресови, маици, дуксери, блузони до стикери, шишиња и други производи за патриоти. Посетете нè сега!"/>
            <meta name="keywords"
                  content="патриотизам, patriotizam, македонски знамиња, makedonski znaminja, kutles, кутлеш, знаме кутлеш, zname kutles, patrioti, патриоти, patiotsko drustvo, патриотско друштво, македонски дресови, makedonski dresovi, патриотски маици, patriotski maici"/>
            <base href="/"/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="Непокор.мк - Непокорот е слобода!"/>
            <meta property="og:description"
                  content="Најголем избор на македонски патриотски производи на едно место. Од македонски знамиња, македонски дресови, маици, дуксери, блузони до стикери, шишиња и други производи за патриоти. Посетете нè сега!"/>
            <meta property="og:url" content="https://nepokor.mk/"/>
            <meta property="og:image:type" content="image/png"/>
            <meta property="og:image:width" content="3000"/>
            <meta property="og:image:height" content="2409"/>
            <meta property="og:image" content="https://midasai.vercel.app/favicon.ico"/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="Непокор.мк - Непокорот е слобода!"/>
            <meta name="twitter:description"
                  content="Најголем избор на македонски патриотски производи на едно место. Од македонски знамиња, македонски дресови, маици, дуксери, блузони до стикери, шишиња и други производи за патриоти. Посетете нè сега!"/>
            <meta name="twitter:url" content="https://nepokor.mk/"/>
            <meta name="twitter:image:type" content="image/png"/>
            <meta name="twitter:image:width" content="3000"/>
            <meta name="twitter:image:height" content="2409"/>
            <meta name="twitter:image" content="https://midasai.vercel.app/logo.png"/>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}
