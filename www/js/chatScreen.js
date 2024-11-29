// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, onSnapshot, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { firebaseConfig } from './firebase0823.js';


// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    // 成功した場合の処理．今回はここでは何もしない．
    console.log("Firebase initialize success!");
} catch (error) {
    alert(`Firebase app initialize error: ${error}`);
}

// ====================================
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


// 書き込み
document.querySelector("#MesSave").addEventListener("click", async function () {
    const message = document.querySelector("#MesText").value;

    
    try {
        const docRef = await addDoc(collection(db, "users"), {
            message: message,
            to: "k21h2078",
            me: "k21h2025",
            timestamp: new Date()  // 現在の日時を追加
        });
        console.log("Document written with ID: ", docRef.id);
        document.querySelector("#MesText").value = "";
        
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});


// 読み取り
document.addEventListener("DOMContentLoaded", function () {
    // データベースの参照を作成
    const usersRef = collection(db, "users");

    // データを登録日時でソートするためのクエリ
    const q = query(usersRef, orderBy("timestamp", "asc"));

    const container = document.querySelector('.mesContents');




// ページが完全に読み込まれてからスクロールを一番下に設定
    window.onload = function () {
        // 少し遅らせてからスクロールを設定
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100); // 100ミリ秒の遅延
    };






    // クエリのスナップショットをリアルタイムで監視
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // mesContentsクラスのdiv要素を取得
        //const container = document.querySelector('.mesContents');

        // 以前の内容をクリア
        container.innerHTML = "";

        // 該当するレコードがない場合の処理
        if (querySnapshot.empty) {
            container.innerHTML = '<div>該当する結果はありません</div>';
            return;
        }

        // div要素を生成してメッセージを表示
        querySnapshot.forEach((doc) => {
            const me = doc.data().me;

            if (me === "k21h2025" || me === "k21h2078") {
                const item = document.createElement('div');
                item.textContent = `${doc.data().message}`;

                // クラス名を追加
                if (me === "k21h2025") {
                    item.classList.add('myMes');
                } else if (me === "k21h2078") {
                    item.classList.add('k21h2078Mes');
                }

                container.appendChild(item);
            }
        });

         // DOMの更新が完了した後にスクロールを一番下に移動
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });

    }, (error) => {
        console.error("Error getting documents: ", error);
    });

    // 画面が閉じられるときにスナップショットの監視を停止
    window.addEventListener("beforeunload", () => {
        unsubscribe();
    });
});


