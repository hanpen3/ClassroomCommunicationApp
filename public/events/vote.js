document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('back-btn');
    const startVoteBtn = document.getElementById('start-vote-btn');
    const voteQuestion = document.getElementById('vote-question');
    const voteOption1 = document.getElementById('vote-option1');
    const voteOption2 = document.getElementById('vote-option2');
    
    backBtn.addEventListener('click', () => {
        window.location.href = '../host.html';
    });
    
    startVoteBtn.addEventListener('click', () => {
        // ここで投票を開始する処理を追加
        alert(`投票が開始されました！\n質問: ${voteQuestion.value}\n選択肢1: ${voteOption1.value}\n選択肢2: ${voteOption2.value}`);
    });
});