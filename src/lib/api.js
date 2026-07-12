// lib/api.js

const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;


export async function authenticatedFetch(
    endpoint,
    options = {}
) {

    if (!API_URL) {

        throw new Error(
            "NEXT_PUBLIC_API_BASE_URL is missing"
        );

    }


    if (
        typeof window === "undefined"
    ) {

        throw new Error(
            "Telegram authentication unavailable"
        );

    }


    const tg =
        window.Telegram?.WebApp;


    if (!tg) {

        throw new Error(
            "Telegram WebApp SDK not loaded"
        );

    }


    const initData =
        tg.initData;


    console.log(
        "Telegram initData:",
        initData
    );


    if (!initData) {

        throw new Error(
            "Missing Telegram authentication data"
        );

    }



    const headers = {

        "Content-Type":
            "application/json",

        "X-Telegram-Init-Data":
            initData,

        ...(options.headers || {})

    };



    const url =
        `${API_URL}${endpoint}`;


    console.log(
        "API REQUEST:",
        url
    );


    const response =
        await fetch(
            url,
            {
                ...options,
                headers
            }
        );



    if (
        response.status === 401 ||
        response.status === 403
    ) {

        const body =
            await response.json()
                .catch(
                    () => ({})
                );


        console.error(
            "AUTH FAILED:",
            body
        );


        throw new Error(
            body.error ||
            "Access denied"
        );

    }


    return response;

}