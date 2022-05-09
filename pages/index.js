import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Hirozumi Takeda</title>
        <meta name="description" content="Designer, Developper, Director. Founder at HAUS. Lecturer at Joshibi University of Art and Design." />
      </Head>
      <main>
        <h1>Hirozumi Takeda</h1>
        <p>Designer, Developer, Director.</p>
        <p>Founder at <a href="https://h4us.jp">HAUS</a>.</p>
        <p>Lecturer at Joshibi University of Art and Design.</p>
      </main>
      <nav>
        <ul>
          <li><a href="https://github.com/thirozumi">GitHub</a></li>
          <li><a href="https://are.na/hirozumi-takeda">Are.na</a></li>
          <li><a href="https://twitter.com/thirozumi">Twitter</a></li>
          <li><a href="https://www.instagram.com/thirozumi/">Instagram</a></li>
          <li><a href="https://www.facebook.com/thirozumi">Facebook</a></li>
        </ul>
      </nav>
      <footer>
        <p>thirozumi at gmail.com</p>
      </footer>
    </>
  )
}
