// Existing bookmarked History routes still lead to their original lessons.
function openHistoryBookmark(){
  if(location.hash.startsWith('#/')){
    location.replace(new URL('american-history.html'+location.hash,location.href));
  }
}
openHistoryBookmark();
window.addEventListener('hashchange',openHistoryBookmark);
