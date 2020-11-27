import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ListingTable from './ListingTable';
import { HOST, STOCK_ENDPOINT } from '../constants/url';

class ConsumerView extends Component {
    constructor() {
        super();
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        let fetched_quantities = fetch(proxyurl + HOST + STOCK_ENDPOINT)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(
                e => {
                    console.log(e);
                    return e;
                }
            );
        console.log(fetched_quantities);

        this.state = {
            listings: [],
            cart: []
        }
        var myHeaders = new Headers();
        console.log("getting store inventory...");
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "storeId": "1"
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        // make API call with parameters and use promises to get response
        fetch("https://92lspe5vz7.execute-api.us-east-1.amazonaws.com/dev/inventory", requestOptions)
            .then(response => response.text())
            .then(result => {
                // console.log(JSON.parse(result).body);
                this.state.listing = JSON.parse(result).body;
            })
            .catch(error => console.log('error', error));
        console.log(this.state);
        this.state.cart = [];
        // this.state = {
        //     listings: [
        //         {
        //           "inventoryId (S)": 1,
        //           "amount (N)": 100,
        //           "price (N)": 5,
        //           "priceUnit (S)": "per 5",
        //           "productDesc (S)": "Large sweet apples grown in BC.",
        //           "productName (S)": "Ambrosia Apples",
        //           "storeId (S)": 1
        //         },
        //         {
        //           "inventoryId (S)": 2,
        //           "amount (N)": 3,
        //           "price (N)": 2.99,
        //           "priceUnit (S)": "per 2 pounds",
        //           "productDesc (S)": "Thin sugary sweet potatoes used in Korean cuisine",
        //           "productName (S)": "Purple Sweet Potatoes",
        //           "storeId (S)": 1
        //         },
        //         {
        //           "inventoryId (S)": 3,
        //           "amount (N)": 30,
        //           "price (N)": 8.99,
        //           "priceUnit (S)": "per 5 pounds",
        //           "productDesc (S)": "Home grown apples that are very sour and satisfying.",
        //           "productName (S)": "Organic Granny Smith Apples",
        //           "storeId (S)": 1
        //         }
        //        ],
        //     cart: []
        // };
    }

    addToCart(inventoryId, productName) {
        var newCart = this.state.cart;
        for (let i=0; i < newCart.length; i++) {
            if (newCart[i].inventoryId === inventoryId) {
                newCart[i].quantity += 1;
                this.setState({
                    cart: newCart
                })
                return;
            }
        }

        var newCartItem = {'inventoryId': inventoryId, 'productName': productName, 'quantity': 1};
        newCart.push(newCartItem);
        this.setState({
            cart: newCart
        })
    }

    removeFromCart(productName) {
        var newCart = this.state.cart;
        for (let i=0; i < newCart.length; i++) {
            if (newCart[i].productName === productName) {
                newCart.splice(i, 1);
                this.setState({
                    cart: newCart
                })
            }
        }
    }

    render() {
        var cartItems = [];
        this.state.cart.forEach(element => cartItems.push(<h6 key={element}>{element.productName}: {element.quantity}&nbsp;
            <button onClick={() => this.removeFromCart(element.productName)}>Remove from cart</button></h6>));
        return (
            <div>
                <h1>User {this.state.listings[0]["storeId"]}'s Store</h1>
                <ListingTable isConsumer={true} listings={this.state.listings} addToCart={this.addToCart.bind(this)}/>
                <Button onClick={() => alert("Checkout clicked")}>Checkout</Button>
                <div><h4>Cart:</h4> {cartItems}</div>
            </div>
        );
    }
}

export default ConsumerView;