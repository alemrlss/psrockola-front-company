import { Card, CardContent, Typography, Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";

function TransactionsSubcompany({ data }) {
  const { t } = useTranslation();
  // Limitar el número de tarjetas a mostrar
  const maxCardsToShow = 10;
  const cardsToShow = data.slice(0, maxCardsToShow);

  // Determinar el número de columnas para la cuadrícula

  return (
    <div className="container mx-auto px-4 mb-6">
      {data.length !== 0 && (
        <h2 className="text-2xl font-bold mb-4">
          {t("view_dashboard_top_10_transfers")}
        </h2>
      )}
      <div className={`grid grid-cols-1 md:grid-cols-${5} gap-4`}>
        {cardsToShow.map((transaction, index) => (
          <div key={transaction.Subcompany_id} className="w-full">
            <Card className="bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg hover:shadow-xl h-40">
              <CardContent className="flex flex-col justify-center items-center h-full">
                <Avatar
                  alt={transaction.Subcompany_name}
                  className="w-12 h-12 mb-4"
                />
                <Typography
                  className="font-bold text-center text-white mb-2"
                  sx={{
                    fontSize: 14,
                  }}
                >
                  {index + 1}. {transaction.Subcompany_name}
                </Typography>
                <Typography
                  className="text-center text-white"
                  sx={{
                    fontSize: 18,
                  }}
                >
                  <b>{transaction.totalamount} Rockobits</b>
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsSubcompany;
