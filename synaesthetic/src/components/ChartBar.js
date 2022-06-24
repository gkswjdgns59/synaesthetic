import React, { useEffect, useState } from "react";
import styles from './style.module.css';

export default function ChartBar(props) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (props.reverse == true) {
            if (props.bound - props.data < 0) {
                setWidth(0.01);
            } else {
                setWidth((props.bound - props.data) / props.bound * 20);
            }
        } else {
            if (props.data > props.bound) {
                setWidth(20);
            } else {
                setWidth(props.data / props.bound * 20);
            }
        }
    }, [props]);


    return (
        <>
            <div style = {{
                width : `${width}rem`,
                backgroundColor : '#7E7E7E'
            }}></div>
        </>
    )
}