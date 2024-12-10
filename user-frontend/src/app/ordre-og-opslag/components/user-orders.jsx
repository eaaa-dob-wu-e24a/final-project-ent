import OrderCard from "./order-card";

export default function UserOrders({ orders }) {
  // create 'orders' object with owner and renter arrays
  const { owner, renter } = orders;

  // filter 'owner' and 'renter' arrays for active orders (status: godkendt)
  const activeOwnerOrders = owner.filter(
    (order) => order.order_status === "godkendt"
  );
  const activeRenterOrders = renter.filter(
    (order) => order.order_status === "godkendt"
  );

  // combine 'owner' and 'renter' arrays and filter for ended orders (status: afsluttet)
  const endedOrders = [...owner, ...renter].filter(
    (order) => order.order_status === "afsluttet"
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="">
        <h2 className="font-bold mb-4">Dine udlejede ordre:</h2>
        <div className="flex flex-col gap-4">
          {activeOwnerOrders.length > 0 ? (
            activeOwnerOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                color="#5BAD86"
                iconStyles={{
                  bg: "bg-darkgreen",
                  iconBg: "bg-[#E2F0E9] text-darkgreen",
                  line: "#E2F0E9",
                }}
              />
            ))
          ) : (
            <p className="text-gray-600 text-lg font-medium">
              Du har ikke nogen udlejede ordre lige nu.
            </p>
          )}
        </div>
      </div>

      <div className="">
        <h2 className="font-bold mb-4">Dine lejede ordre:</h2>
        <div className="flex flex-col gap-4">
          {activeRenterOrders.length > 0 ? (
            activeRenterOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                color="#5BAD86"
                iconStyles={{
                  bg: "bg-darkgreen",
                  iconBg: "bg-[#E2F0E9] text-darkgreen",
                  line: "#E2F0E9",
                }}
              />
            ))
          ) : (
            <p className="text-gray-600 text-lg font-medium">
              Du har ikke nogle lejede ordre lige nu.
            </p>
          )}
        </div>
      </div>

      <div className="">
        <h2 className="font-bold mb-4">Historik:</h2>
        <div className="flex flex-col gap-4">
          {endedOrders.length > 0 ? (
            endedOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                color="#FF7127"
                iconStyles={{
                  bg: "bg-orangebg",
                  iconBg: "bg-[#FFDBC9] text-orangebg",
                  line: "#FFDBC9",
                }}
              />
            ))
          ) : (
            <p className="text-gray-600 text-lg font-medium">
              Der er ingen ordre i din historik.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
