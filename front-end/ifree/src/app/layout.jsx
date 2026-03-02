import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import "./global.css";

export const metadata = {
  title: "Meu App",
  description: "Projeto Next",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        < Header />

        {children}

        <Footer/> 
      </body>
    </html>
  );
}
