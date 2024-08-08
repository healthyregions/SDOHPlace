export default function Copyright() {
  const year = new Date().getFullYear();
  return <p className={"m-2 text-center"}>&copy; {year}</p>;
}
