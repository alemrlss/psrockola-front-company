import React from "react";
import { Card, CardContent, Typography, Avatar } from "@mui/material";

function TransactionsSubcompany({ data }) {
  // Limitar el número de tarjetas a mostrar
  const maxCardsToShow = 10;
  const cardsToShow = data.slice(0, maxCardsToShow);

  // Determinar el número de columnas para la cuadrícula
  const numColumns = cardsToShow.length <= 5 ? 5 : 5;

  return (
    <div className="container mx-auto px-4 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Top 10 Transfers by Subcompany
      </h2>
      <div className={`grid grid-cols-1 md:grid-cols-${numColumns} gap-4`}>
        {cardsToShow.map((transaction, index) => (
          <div key={transaction.Subcompany_id} className="w-full">
            <Card className="bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg hover:shadow-xl h-40">
              <CardContent className="flex flex-col justify-center items-center h-full">
                <Avatar
                  alt={transaction.Subcompany_name}
                  className="w-12 h-12 mb-4"
                />
                <Typography
                  variant="h6"
                  className="font-bold text-center text-white mb-2"
                >
                  {index + 1}. {transaction.Subcompany_name}
                </Typography>
                <Typography
                  className="text-center text-white"
                  sx={{
                    fontSize: 14,
                  }}
                >
                  Total Amount: <b>{transaction.totalamount}</b> rockobits
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
        {/* Rellenar con tarjetas vacías si es necesario */}
        {[...Array(maxCardsToShow - cardsToShow.length)].map((_, index) => (
          <div key={index + cardsToShow.length} className="w-full">
            <Card className="bg-gray-200 shadow-lg h-40">
              <CardContent className="flex flex-col justify-center items-center h-full">
                <Typography
                  variant="h6"
                  className="font-bold text-center text-gray-500 mb-2"
                >
                  {index + cardsToShow.length + 1}.
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
