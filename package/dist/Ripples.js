"use client";
//just for next.js
import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
//ripples
function addRipple(element, event, color, opacity, blur, duration, fillAndHold, neverRemove, rippleElement, className, zIndex) {
    const newRipple = document.createElement("div");
    //handle custom ripple
    const newRoot = rippleElement && ReactDOM.createRoot(newRipple);
    newRoot && newRoot.render(rippleElement);
    //styles for ripple
    Object.assign(newRipple.style, {
        position: "absolute",
        borderRadius: "50%",
        transform: "scale(0)",
        zIndex: zIndex,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color,
        opacity: String(opacity),
        filter: `blur(${blur}rem)`,
        transition: `transform ${duration}ms linear, opacity ${duration}ms linear`,
    });
    //append param classes to ripple element
    className &&
        className
            .split(" ")
            .forEach((className) => className && newRipple.classList.add(className));
    //determine and set size and position
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const left = event.clientX - rect.left - size / 2;
    const top = event.clientY - rect.top - size / 2;
    Object.assign(newRipple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}px`,
        top: `${top}px`,
    });
    //append
    element.appendChild(newRipple);
    //trigger the ripple effect
    setTimeout(() => {
        newRipple.style.transform = "scale(4)";
        if (!fillAndHold) {
            newRipple.style.opacity = "0";
        }
    }, 0);
    //remove (only if neverRemove is false, and fillAndHold is also false)
    if (!neverRemove && !fillAndHold) {
        setTimeout(() => {
            element.removeChild(newRipple);
        }, duration);
    }
    //handle fill and hold
    if (fillAndHold) {
        document.addEventListener("mouseup", () => {
            newRipple.style.opacity = "0";
            if (!neverRemove) {
                setTimeout(() => {
                    element.removeChild(newRipple);
                }, duration);
            }
        }, {
            once: true,
        });
    }
}
//ripple component
export function Ripples({ on = "click", color = "white", opacity = 1, blur = 0, duration = 500, fillAndHold = false, optimize = false, rippleElement, className, zIndex, }) {
    const neverRemove = !optimize;
    const ripplesurfaceRef = useRef(null);
    const style = {
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        position: "absolute",
        zIndex,
    };
    const handleEvent = (event) => {
        addRipple(ripplesurfaceRef.current, event, color, opacity, blur, duration, fillAndHold, neverRemove, rippleElement, className);
    };
    const eventHandlers = {};
    if (fillAndHold) {
        eventHandlers.onMouseDown = handleEvent;
    }
    else if (on === "mouseDown") {
        eventHandlers.onMouseDown = handleEvent;
    }
    else if (on === "click") {
        eventHandlers.onClick = handleEvent;
    }
    else if (on === "hover") {
        eventHandlers.onMouseEnter = handleEvent;
    }
    else if (on === "clickAndMouseDown") {
        eventHandlers.onClick = handleEvent;
        eventHandlers.onMouseDown = handleEvent;
    }
    return (React.createElement("div", Object.assign({ "aria-hidden": true, ref: ripplesurfaceRef, style: style }, eventHandlers)));
}
