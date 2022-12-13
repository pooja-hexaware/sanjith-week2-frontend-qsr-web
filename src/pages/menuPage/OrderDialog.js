import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { calculateNetPrice, closeOrderDialog, resetOrderData, setCouponFinalPrice, setFinalPrice } from "./store/menuPageSlice";
import { useEffect, useState } from "react";
import { addOrder, fetchComboData } from "./store/menu.actions";
import { useNavigate } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const couponsMap = {
    JUMBO: {
        discountPrice: 4.23
    },
    DECEOK: {
        discountPrice: 2.23
    },
    ACK: {
        discountPrice: 2.12
    }
}

function OrderDialog() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const dialogConfig = useSelector(state => state.menu.orderDialog)

    const user = useSelector(state => state.user)

    const selectedMenuItems = useSelector(state => state.menu.selectedMenuItems.data)
    const selectedToppings = useSelector(state => state.menu.selectedToppings.data)
    const selectedToppingsDetails = useSelector(state => state.menu.selectedToppings.details)

    const comboTotal = useSelector(state => state.menu.selectedMenuItems.comboTotal);
    const comboDetails = useSelector(state => state.menu.selectedMenuItems.comboDetails);

    const netPrice = useSelector(state => state.menu.selectedMenuItems.netPrice);
    const finalPrice = useSelector(state => state.menu.selectedMenuItems.finalPrice);
    const finalCouponPrice = useSelector(state => state.menu.selectedMenuItems.finalCouponPrice);

    const [coupon, setCoupon] = useState('')
    const [couponState, setCouponState] = useState(null)

    const handleClose = () => {
        dispatch(closeOrderDialog());
    };

    useEffect(() => {
        dispatch(fetchComboData({ menuItems: selectedMenuItems })).then(() => {
            dispatch(setFinalPrice())
        });
    }, [selectedMenuItems])

    useEffect(() => {
        dispatch(calculateNetPrice())
        console.log("Order Data :", finalPrice, comboTotal)
    }, [selectedMenuItems, selectedToppings])

    const checkCoupon = () => {
        let couponDetails = couponsMap[coupon];
        console.log(new Date().getMonth());
        if (couponDetails !== {}) {
            if (coupon === 'JUMBO' && comboDetails?.length !== 0) {
                dispatch(setCouponFinalPrice(couponDetails.discountPrice))
                setCouponState(true);
            }
            else if (coupon === 'DECEOK' && new Date().getMonth() === 11) {
                console.log("In Dec");
                dispatch(setCouponFinalPrice(couponDetails.discountPrice))
                setCouponState(true)
            }
            else if (coupon.slice(0, 3) === 'ACK') {
                dispatch(setCouponFinalPrice(2.12))
                setCouponState(true)
            }
            else {
                setCouponState(false)
            }
        }
        else {
            setCouponState(false);
        }
    }

    const placeOrder = async () => {
        let order = {
            orderedItems: Object.values(selectedMenuItems),
            finalPrice: finalCouponPrice,
            comboDetails: comboDetails,
            comboTotal: comboTotal,
            phone: user.phone
        }
        console.log("Final Order : ", order)
        dispatch(addOrder(order)).then(() => {
            // dispatch(addLoyaltyPoints());
            dispatch(closeOrderDialog())
            dispatch(resetOrderData())
            navigate("/stores")
        })
    }

    useEffect(() => {
        if (coupon === "") {
            setCouponState(false)
        }
    }, [coupon])

    return (
        <Dialog onClose={handleClose} open={dialogConfig.props.open} fullWidth>
            <DialogTitle>Order Summary</DialogTitle>
            <DialogContent>
                <List sx={{ pt: 0 }}>
                    {Object.values(selectedMenuItems)?.map((menuItem, index) => (
                        <>
                            <div className="menuHeader">
                                <ListItem key={index} style={{ padding: "0px 20px" }}>
                                    <ListItemText primary={menuItem?.name} secondary={menuItem?.description} />
                                </ListItem>
                                <ListItem key={index} style={{ padding: "0px 20px" }}>
                                    Price : &nbsp;$<ListItemText primary={menuItem?.price} />
                                </ListItem>
                            </div>
                            <Typography variant="p" fontWeight={"600"} style={{ padding: "0px 20px" }}>Add Ons</Typography>
                            {selectedToppings[menuItem.id].map((toppingId) => (
                                <div className="menuHeader">
                                    <ListItem key={toppingId} style={{ padding: "0px 20px" }}>
                                        <ListItemText primary={selectedToppingsDetails[toppingId]?.name} secondary={`${selectedToppingsDetails[toppingId]?.calories} cal`} />
                                    </ListItem>
                                    <ListItem key={toppingId} style={{ padding: "0px 20px" }}>
                                        <ListItemText primary={`$ ${selectedToppingsDetails[toppingId]?.price}`} />
                                    </ListItem>
                                </div>

                            ))}
                            <ListItem key={index} style={{ padding: "0px 20px", maxWidth: "12vw" }}>
                                Quantity : &nbsp;<ListItemText style={{ border: "1px solid black", borderRadius: "20px", padding: "4px" }} primary={`X ${menuItem?.amount}`} />
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                    <div className="menuHeader">
                        <ListItem style={{ padding: "0px 20px" }}>
                            <ListItemText primary={"Net Price"} />
                        </ListItem>
                        <ListItem style={{ padding: "0px 20px" }}>
                            $<ListItemText primary={netPrice} />
                        </ListItem>
                    </div>
                    <div className="menuHeader">
                        <ListItem style={{ padding: "0px 20px" }}>
                            <ListItemText primary={"Total Combo Discount"} />
                        </ListItem>
                        <ListItem style={{ padding: "0px 20px" }}>
                            $<ListItemText primary={comboTotal} />
                        </ListItem>
                    </div>
                    <div className="menuHeader">
                        <ListItem style={{ padding: "0px 20px" }}>
                            <ListItemText primary={"Amount After Discount"} />
                        </ListItem>
                        <ListItem style={{ padding: "0px 20px" }}>
                            $<ListItemText primary={finalPrice} />
                        </ListItem>
                    </div>
                    <br />
                    <div className="menuHeader">
                        <TextField
                            type="text"
                            placeholder="Enter Coupon Code"
                            variant="outlined"
                            size="small"
                            value={coupon}
                            onChange={(ev) => setCoupon(ev.target.value)}
                        />
                        <Button variant="filled" style={{ color: "#FFFFFF", backgroundColor: "#1B4F72" }} onClick={() => checkCoupon()}>Apply Coupon</Button>
                    </div>
                    {couponState && (
                        <>
                            <div className="menuHeader">
                                <ListItem style={{ padding: "0px 20px" }}>
                                    <ListItemText primary={`${coupon} Coupon Applied`} />
                                </ListItem>
                                <ListItem style={{ padding: "0px 20px" }}>
                                    $<ListItemText primary={couponsMap[coupon]?.discountPrice} />
                                </ListItem>
                            </div>
                        </>
                    )}
                    <br />
                    <div className="menuHeader">
                        <ListItem style={{ padding: "0px 20px" }}>
                            <ListItemText primary={"Total Amount"} />
                        </ListItem>
                        <ListItem style={{ padding: "0px 20px" }}>
                            $<ListItemText primary={finalCouponPrice} />
                        </ListItem>
                    </div>
                    {(couponState === false && coupon !== "") && (
                        <Typography variant="p" color={"error"}>Coupon cannot be applied.</Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                {netPrice !== 0 && <Button variant="filled" style={{ color: "#FFFFFF", backgroundColor: "#1B4F72" }} onClick={() => placeOrder()}>Place Order</Button>}
            </DialogActions>
        </Dialog>
    );
}

export default (OrderDialog);