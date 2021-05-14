const router = require("express").Router();
const parseString = require("xml2js").parseString;
const soap = require("soap");
const https = require("https");

const url =
  "http://www.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/?WSDL";

router.get("/currency", getCurrency);
router.post("/currency", getCurrencyPost);

async function getCurrency(req, res, next) {
  try {
    const {
      query: { iso1, iso2 },
    } = req;

    if (!iso1) {
      return res.status(400).send({ message: "the iso1 is required" });
    }

    if (!iso2) {
      return res.status(400).send({ message: "the iso2 is required" });
    }

    soap.createClient(url, function (err, client) {
      if (!client) {
        return res
          .status(400)
          .send({ message: "Swagger can't using with soap" });
      }

      client.CountryCurrency(
        { sCountryISOCode: iso1.toUpperCase() },
        function (err, { CountryCurrencyResult }) {
          client.CountryCurrency(
            { sCountryISOCode: iso2.toUpperCase() },
            function (err, { CountryCurrencyResult: CountryCurrencyResult2 }) {
              xmlToJson(url, function (data) {
                const countries = data["gesmes:Envelope"].Cube[0].Cube[0].Cube;

                let iso1Currency, iso2Currency;
                if (
                  CountryCurrencyResult.sISOCode === "EUR" &&
                  CountryCurrencyResult2.sISOCode === "EUR"
                ) {
                  iso1Currency = { $: { currency: "EUR", rate: 1 } };
                  iso2Currency = { $: { currency: "EUR", rate: 1 } };
                } else if (CountryCurrencyResult.sISOCode === "EUR") {
                  iso1Currency = { $: { currency: "EUR", rate: 1 } };
                  iso2Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult2.sISOCode
                  );
                } else if (CountryCurrencyResult2.sISOCode === "EUR") {
                  iso1Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult.sISOCode
                  );
                  iso2Currency = { $: { currency: "EUR", rate: 1 } };
                } else {
                  iso1Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult.sISOCode
                  );

                  iso2Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult2.sISOCode
                  );
                }

                if (!iso1Currency || !iso2Currency) {
                  return res.status(400).send({ message: "The iso not found" });
                }

                const rate = {
                  currency:
                    iso1Currency["$"].currency +
                    " / " +
                    iso2Currency["$"].currency,
                  rate: iso2Currency["$"].rate / iso1Currency["$"].rate,
                };

                res.send(rate);
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

async function getCurrencyPost(req, res, next) {
  try {
    const {
      body: { iso1, iso2 },
    } = req;

    if (!iso1) {
      return res.status(400).send({ message: "the iso1 is required" });
    }

    if (!iso2) {
      return res.status(400).send({ message: "the iso2 is required" });
    }

    soap.createClient(url, function (err, client) {
      if (!client) {
        return res.send({ message: "Swagger can't using with soap" });
      }

      client.CountryCurrency(
        { sCountryISOCode: iso1.toUpperCase() },
        function (err, { CountryCurrencyResult }) {
          client.CountryCurrency(
            { sCountryISOCode: iso2.toUpperCase() },
            function (err, { CountryCurrencyResult: CountryCurrencyResult2 }) {
              xmlToJson(url, function (data) {
                const countries = data["gesmes:Envelope"].Cube[0].Cube[0].Cube;

                let iso1Currency, iso2Currency;
                if (
                  CountryCurrencyResult.sISOCode === "EUR" &&
                  CountryCurrencyResult2.sISOCode === "EUR"
                ) {
                  iso1Currency = { $: { currency: "EUR", rate: 1 } };
                  iso2Currency = { $: { currency: "EUR", rate: 1 } };
                } else if (CountryCurrencyResult.sISOCode === "EUR") {
                  iso1Currency = { $: { currency: "EUR", rate: 1 } };
                  iso2Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult2.sISOCode
                  );
                } else if (CountryCurrencyResult2.sISOCode === "EUR") {
                  iso1Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult.sISOCode
                  );
                  iso2Currency = { $: { currency: "EUR", rate: 1 } };
                } else {
                  iso1Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult.sISOCode
                  );

                  iso2Currency = countries.find(
                    (x) => x["$"].currency === CountryCurrencyResult2.sISOCode
                  );
                }

                if (!iso1Currency || !iso2Currency) {
                  return res.status(400).send({ message: "The iso not found" });
                }

                const rate = {
                  currency:
                    iso1Currency["$"].currency +
                    " / " +
                    iso2Currency["$"].currency,
                  rate: iso2Currency["$"].rate / iso1Currency["$"].rate,
                };

                res.send(rate);
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = router;

function xmlToJson(url, callback) {
  var url = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

  https.get(url, function (res) {
    var xml = "";

    res.on("data", function (chunk) {
      xml += chunk;
    });

    res.on("end", function () {
      parseString(xml, function (err, result) {
        callback(result);
      });
    });
  });
}
