import { useTranslation } from "react-i18next";
import SalesForEmployee from "./Sales/SalesForEmployee";

function Sales({ ownSales, salesForEmployee }) {
  const { t } = useTranslation();
  return (
    <div className="my-6 ">
      {salesForEmployee.length > 0 && (
        <>
          <h2 className="text-center font-bold text-xl mb-2">
            {t("view_dashboard_employees_sales")}
          </h2>
          <SalesForEmployee salesForEmployee={salesForEmployee} />
        </>
      )}
    </div>
  );
}

export default Sales;
