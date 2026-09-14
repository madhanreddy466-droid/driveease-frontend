export default function About() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="eyebrow">About Us</div>
        <h2 className="section-title">Renting, reimagined</h2>
        <p style={{ color: 'var(--light)', lineHeight: 1.7, marginBottom: 16 }}>
          DRIVEEASE started with a simple frustration: renting a car shouldn't mean
          standing in line with a folder of paperwork. We built a fleet of 48 cars —
          from daily hatchbacks to hypercars — that you can browse, price out, and
          reserve in minutes.
        </p>
        <p style={{ color: 'var(--light)', lineHeight: 1.7, marginBottom: 16 }}>
          Every booking includes insurance, and pickup is available from four hubs
          across Hyderabad. Sign up, pick your car, choose your dates, and you're set.
        </p>
      </div>
    </div>
  );
}
