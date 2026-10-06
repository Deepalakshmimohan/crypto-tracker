import React from "react";
import milify from "millify";
import { Typography, Row, Col, Statistic } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;
import { useGetCryptosQuery } from "../services/cryptoApi";
import Cryptocurrencies from "./Cryptocurrencies";
import Loader from "./Loader";

const Home = () => {
  const { data, isFetching, error } = useGetCryptosQuery(10);
  
  if (isFetching) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.data?.stats) return <div>No data available</div>;
  
  const globalStats = data.data.stats;

  return (
    <>
      <Title level={2} className="heading">
        Global Crypto Stats
      </Title>
      <Row>
        <Col span={12}>
          <Statistic title="Total Cryptocurrencies" value={globalStats?.total || 0} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Total Exchanges"
            value={globalStats?.totalExchanges ? milify(globalStats.totalExchanges) : 0}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Total Market Cap"
            value={globalStats?.totalMarketCap ? milify(globalStats.totalMarketCap) : 0}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Total 24h Volume"
            value={globalStats?.total24hVolume ? milify(globalStats.total24hVolume) : 0}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Total Markets"
            value={globalStats?.totalMarkets ? milify(globalStats.totalMarkets) : 0}
          />
        </Col>
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">
          Top 10 Cryptocurrencies in the world
        </Title>
        <Title level={3} className="show-more">
          <Link to="/cryptocurrencies">Show More</Link>
        </Title>
      </div>
      <Cryptocurrencies simplified />
    </>
  );
};

export default Home;
