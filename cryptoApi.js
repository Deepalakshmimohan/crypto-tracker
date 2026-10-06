import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoApiHeaders = {
  'x-cg-demo-api-key': 'CG-DTuBYGBNtYTab16GNtSTL9VM'
};

const baseUrl = "https://api.coingecko.com/api/v3";

const createRequest = (url) => ({ url, headers: cryptoApiHeaders });

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: (count) => createRequest(`/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`),
      transformResponse: (response) => ({
        data: {
          stats: {
            total: response.length,
            totalMarketCap: response.reduce((acc, coin) => acc + coin.market_cap, 0),
            total24hVolume: response.reduce((acc, coin) => acc + coin.total_volume, 0),
            totalMarkets: response.reduce((acc, coin) => acc + coin.total_supply || 0, 0),
            totalExchanges: response.length
          },
          coins: response.map(coin => ({
            uuid: coin.id,
            rank: coin.market_cap_rank,
            name: coin.name,
            iconUrl: coin.image,
            price: coin.current_price,
            marketCap: coin.market_cap,
            dailyChange: coin.price_change_percentage_24h,
            symbol: coin.symbol
          }))
        }
      })
    }),

    getCryptoDetails: builder.query({
      query: (coinId) => createRequest(`/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`),
      transformResponse: (response) => ({
        data: {
          coin: {
            uuid: response.id,
            name: response.name,
            description: response.description.en || '',
            symbol: response.symbol,
            rank: response.market_cap_rank,
            price: response.market_data.current_price.usd,
            marketCap: response.market_data.market_cap.usd,
            '24hVolume': response.market_data.total_volume.usd,
            numberOfMarkets: response.market_data.market_cap_rank,
            numberOfExchanges: response.market_data.market_cap_rank,
            supply: {
              confirmed: true,
              total: response.market_data.total_supply,
              circulating: response.market_data.circulating_supply
            },
            allTimeHigh: {
              price: response.market_data.ath.usd
            },
            links: response.links.homepage.map(url => ({
              name: 'homepage',
              type: 'Website',
              url: url
            }))
          }
        }
      })
    }),

    getCryptoHistory: builder.query({
      query: ({ coinId, timePeriod }) => 
        createRequest(`/coins/${coinId}/market_chart?vs_currency=usd&days=${timePeriod}`),
      transformResponse: (response) => ({
        data: {
          history: response.prices.map(([timestamp, price]) => ({
            price,
            timestamp
          }))
        }
      })
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} = cryptoApi;
