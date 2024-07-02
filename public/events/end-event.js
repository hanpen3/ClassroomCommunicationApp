document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('back-btn');
    
    backBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    
    // イベント終了後の処理をここに追加
    console.log('イベントが終了しました。後処理を行います。');
});