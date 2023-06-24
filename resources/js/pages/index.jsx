import MainLayout from "./MainLayout";

export default function Index() {
  return (
    <section>
      <h1>tes</h1>
    </section>
  );
}

Index.layout = (page) => <MainLayout children={page} {...page.props} />;
