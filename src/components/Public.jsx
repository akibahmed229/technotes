// internal imports
import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      {/* Header Section*/}
      <header>
        <h1>
          Welcome to <span className="nowrap">Dan D. Repairs!</span>
        </h1>
      </header>

      {/* Main Section */}
      <main className="public__main">
        <p>
          Located in Beautiful Down Foo city, TechNote Repairs offers a wide
          range of services to repair your home and office.
        </p>

        <address className="public__addr">
          TechNote Repairs <br />
          555 Foo Drive <br />
          <a href="tel:+8801449755557"> (014) 497-55557</a>
        </address>
        <br />
        <p>Owner: TechNote Repairs</p>
      </main>

      {/* Footer Section */}
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );

  return content;
};

export default Public;
