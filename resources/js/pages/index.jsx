import MainLayout from "./MainLayout";
export default function Index() {
  return <div></div>;
}

Index.layout = (page) => <MainLayout children={page} {...page.props} />;
