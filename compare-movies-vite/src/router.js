const menu = document.getElementById('landp');
const movies = document.getElementById('moviePage');
const chart = document.getElementById('container');
const foot = document.getElementById('br');


export const handleRouting = async (event) => {
    if (window.location.pathname === '/compare-movies/') {
    
       movies.style.display = 'none';
        chart.style.display = 'none';
        menu.style.display = 'none';
        menu.style.display = 'flex';
        menu.style.visibility = 'visible'
        
    }else if (window.location.pathname ==='/compare-movies/Movies') {
        document.getElementById('source').setAttribute('href','/compare-movies/Movies#br')
        document.getElementById('restoreDefault').style.visibility= 'visible';
        document.getElementById('clearDef').style.visibility = 'visible'
        document.getElementById('se').style.visibility = 'visible'
        menu.style.display = 'none';
        chart.style.display = 'none';
        movies.style.display = 'flex';
        movies.style.visibility = 'visible'
      
    }else if (window.location.pathname === '/compare-movies/Charts') {
        window.addEventListener('resize', function() {
            
            location.reload();
          });
          document.body.style.backgroundColor = '#2d2d2d';
          document.getElementById('br').style.boxShadow = 'none'
          const navParagraphs = document.querySelectorAll('#nav p');
            navParagraphs.forEach((paragraph) => {

            paragraph.style.color = 'white';
            });
            document.getElementById('log2').src = 'public/White-log.png'
            if (window.innerWidth < 699) {
                const navParagraphs2 = document.querySelectorAll('#aaa a');
                navParagraphs.forEach((paragraph) => {
                
                paragraph.style.color = 'black';
                });
            }
    
            document.getElementById('dro').style.color = 'white'
            const logoH2 = document.querySelector('#logo h2');
            logoH2.style.color = 'white';

        document.getElementById('source').setAttribute('href','/compare-movies/Charts#br')
        menu.style.display = 'none';
        movies.style.display = 'none';
        chart.style.display = 'flex';
        chart.style.visibility = 'visible'
    }
}