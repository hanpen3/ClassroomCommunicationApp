document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('back-btn');
    const saveBtn = document.getElementById('save-btn');
    const worksheetText = document.getElementById('worksheet-text');
    
    backBtn.addEventListener('click', () => {
        window.location.href = '../host.html';
    });
    
    saveBtn.addEventListener('click', () => {
        // ここでワークシートの内容を保存する処理を追加
        alert('ワークシートが保存されました！');
    });
    
    // 保存されたワークシートの内容を読み込む（例としてローカルストレージを使用）
    const savedWorksheet = localStorage.getItem('worksheetContent');
    if (savedWorksheet) {
        worksheetText.value = savedWorksheet;
    }
});