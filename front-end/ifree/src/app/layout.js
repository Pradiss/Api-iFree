export const metadata = {
  title: "Meu App",
  description: "Projeto Next",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
