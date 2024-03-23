import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Hirozumi Takeda</title>
        <meta name='og:image' content='https://thirozumi.org/og.png' />
        <meta name='description' content='Designer, Developper, Director. Founder at HAUS. Lecturer at Joshibi University of Art and Design.' />
      </Head>
      <header>
        <h1>Hirozumi Takeda</h1>
      </header>
      <main>
        <p>Designer, Developer</p>
        <p>Found at <a href='https://h4us.jp'>HAUS</a></p>
      </main>
      <nav>
        <ul>
          <li><a href='https://github.com/thirozumi'>GitHub</a></li>
          <li><a href='https://www.instagram.com/thirozumi/'>Instagram</a></li>
        </ul>
      </nav>
      <footer>
        <p>thirozumi at gmail.com</p>
      </footer>
    </>
  )
}