export default function PortfolioList({ profileData }) {
  return (
    <div className="portfolio-list">
      <h3>{profileData.nickname}의 포트폴리오</h3>
      <ul>
        {profileData.portfolio && profileData.portfolio.length > 0 ? (
          profileData.portfolio.map((item, index) => (
            <li key={index}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>

            </li>
          ))
        ) : (
          <li>포트폴리오가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}
