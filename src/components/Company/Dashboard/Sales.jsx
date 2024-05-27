import SalesForEmployee from "./Sales/SalesForEmployee";

function Sales({ ownSales, salesForEmployee }) {
  return (
    <div className="my-6 ">
      <h2 className="text-center font-bold text-xl mb-2">Employees sales</h2>
      <SalesForEmployee salesForEmployee={salesForEmployee} />
    </div>
  );
}

export default Sales;
