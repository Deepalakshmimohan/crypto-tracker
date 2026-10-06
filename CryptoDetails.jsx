import React, { useState } from "react";
import HTMLReactParser from "html-react-parser";
import { useParams } from "react-router-dom";
import millify from "millify";
import { v4 as uuidv4 } from "uuid";
import { Col, Row, Typography, Select } from "antd";
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
const { Option } = Select;
import LineChart from "./LineChart";
import Loader from "./Loader";

import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} from "../services/cryptoApi";

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timePeriod, setTimePeriod] = useState("7");
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({
    coinId,
    timePeriod,
  });

  if (isFetching) return <Loader />;
  if (!data?.data?.coin) return <div>No data available</div>;

  const cryptoDetails = data.data.coin;
  const time = ["24h", "7d", "30d", "1y", "3m", "1y"];

  const stats = [
    {
      title: "Price to USD",
      value: cryptoDetails.price ? `$ ${millify(cryptoDetails.price)}` : "N/A",
      icon: <DollarCircleOutlined />,
    },
    { 
      title: "Rank",
      value: cryptoDetails.rank || "N/A",
      icon: <NumberOutlined />
    },
    {
      title: "24h Volume",
      value: cryptoDetails["24hVolume"] ? `$ ${millify(cryptoDetails["24hVolume"])}` : "N/A",
      icon: <ThunderboltOutlined />,
    },
    {
      title: "Market Cap",
      value: cryptoDetails.marketCap ? `$ ${millify(cryptoDetails.marketCap)}` : "N/A",
      icon: <DollarCircleOutlined />,
    },
    {
      title: "All-time-high",
      value: cryptoDetails.allTimeHigh?.price ? `$ ${millify(cryptoDetails.allTimeHigh.price)}` : "N/A",
      icon: <TrophyOutlined />,
    },
  ];

  const genericStats = [
    {
      title: "Number Of Markets",
      value: cryptoDetails.numberOfMarkets || "N/A",
      icon: <FundOutlined />,
    },
    {
      title: "Number Of Exchanges",
      value: cryptoDetails.numberOfExchanges || "N/A",
      icon: <MoneyCollectOutlined />,
    },
    {
      title: "Supply Status",
      value: cryptoDetails.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />,
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Total Supply",
      value: cryptoDetails.supply?.total ? `$ ${millify(cryptoDetails.supply.total)}` : "N/A",
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Circulating Supply",
      value: cryptoDetails.supply?.circulating ? `$ ${millify(cryptoDetails.supply.circulating)}` : "N/A",
      icon: <ExclamationCircleOutlined />,
    },
  ];

  return (
    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {cryptoDetails.name} ({cryptoDetails.symbol?.toUpperCase()}) Price
        </Title>
        <p>
          {cryptoDetails.name} live price in US dollars.
          View value statistics, market cap and supply.
        </p>
      </Col>
      <Select
        defaultValue="7d"
        className="select-timeperiod"
        placeholder="Select Time Period"
        onChange={(value) => setTimePeriod(value)}
      >
        {time.map((date) => (
          <Option key={date}>{date}</Option>
        ))}
      </Select>

      {coinHistory && (
        <LineChart
          coinHistory={coinHistory}
          currentPrice={cryptoDetails.price ? millify(cryptoDetails.price) : "N/A"}
          coinName={cryptoDetails.name}
        />
      )}

      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">
              {cryptoDetails.name} Value Statistics
            </Title>
            <p>An overview showing the stats of {cryptoDetails.name}</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col key={uuidv4()} className="coin-stats">
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">
              Other Statistics
            </Title>
            <p>An overview showing the stats of all cryptocurrencies</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col key={uuidv4()} className="coin-stats">
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <Col className="coin-desc-link">
        <Row className="coin-desc">
          <Title level={3} className="coin-details-heading">
            What is {cryptoDetails.name}?
          </Title>
          {cryptoDetails.description && (
            <div>{HTMLReactParser(cryptoDetails.description)}</div>
          )}
        </Row>
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">
            {cryptoDetails.name} Links
          </Title>
          {cryptoDetails.links?.map((link) => (
            <Row className="coin-link" key={uuidv4()}>
              <Title level={5} className="link-name">
                {link.type}
              </Title>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.name}
              </a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;
