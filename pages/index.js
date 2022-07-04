import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState,useEffect,useCallback} from 'react'

export default function Home() {
  const [lineRow,setLineRow] = useState([[1,1,1,1,1,1,1,1,1,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,0,0,0,0,0,0,0,0,1],
                                        [1,1,1,1,1,1,1,1,1,1]] )
  const [a,seta] = useState(1);
  const [b,setb] = useState(1);
  const [c,setc] = useState(1);
  const [d,setd] = useState(1);
  const [i,seti] = useState(0);
  const [gyo,setGyo] = useState(1);
  const [retu,setRetu] = useState(0);
  const [move,setMove] = useState([]);
  const [enMove,setEnMove] = useState([]);
  const [enemyRetu,setEnemyRetu] = useState(5);
  const [enemyGyo,setEnemyGyo] = useState(7);
  const [direction,setDirection] = useState([1,1]);
  const [directionme,setDirectionme] = useState([0,0]);
  const [gameState,setGameState] = useState(true);
  const [clearState,setClearState] = useState(false);
  const [gpsx,setGpsx] = useState([]);
  const [gpsy,setGpsy] = useState([]);
  const [gpsx1,setGpsx1] = useState();
  const [gpsy1,setGpsy1] = useState();
  const [done,setDone] = useState(false);


  const henkou = useCallback((bx,by,nx,ny) => {
    let x=0;
    let y=0;
    if(gpsx.length==2 && gpsy.length==2){
      if(bx<nx && retu!=0){
        y=-1;
      }else if(bx>nx && retu!=9){
        y=1;
      }else if(by<ny && gyo!=9){
        x=1;
      }else if(by>ny && gyo!=0){
        x=-1;
      }
      console.log(gpsx,gpsy);
        setGpsx([]);
        setGpsy([]);
    }
    const tmp = [...lineRow];
    let a=retu+y;
    let b=gyo+x;
    if(tmp[a][b]==0){
      tmp[a][b] = 2;

      move.push([a,b])
      setLineRow(tmp);
      setRetu(a);
      setGyo(b);

    }else if(tmp[a][b]==1 && move){
      move.map((item) => {
        tmp[item[0]][item[1]]=1;
      });
      setLineRow(tmp)
      setRetu(a);
      setGyo(b);
      setMove([]);

    }else{
      setRetu(a);
      setGyo(b);
    }
  },[retu,gyo,lineRow,move,gpsx,gpsy]);

  const enemyMove = useCallback((d) => {
    const tmp = [...lineRow];

    let direc=(direction);
    if(tmp[enemyRetu+d[0]][enemyGyo]==1  && tmp[enemyRetu][enemyGyo+d[1]]!=1){
      direc=([(direc[0]*-1),direc[1]]);
    }else if(tmp[enemyRetu+d[0]][enemyGyo]!=1  && tmp[enemyRetu][enemyGyo+d[1]]==1 ){
      direc=([direc[0],(direc[1]*-1)]);
    }else if(tmp[enemyRetu+d[0]][enemyGyo]==1  && tmp[enemyRetu][enemyGyo+d[1]]==1 || tmp[enemyRetu+d[0]][enemyGyo+d[1]]==1){
      direc=([(direc[0]*-1),(direc[1]*-1)]);
    }
    let retu=enemyRetu+direc[0];
    let gyo=enemyGyo+direc[1];

    enMove.push([retu,gyo])
    setEnemyRetu(enemyRetu+direc[0]);
    setEnemyGyo(enemyGyo+direc[1]);
    setDirection(direc);

    if((enMove.length)==5){
      let x=[];
      let y=[];
      enMove.map((item) => {
        x.push(item[0]);
        y.push(item[1]);
      })
      if(x[0]==x[2] && x[2]==x[4] && x[1]==x[3] && y[0]==y[2] && y[2]==y[4] && y[1]==y[3]){
        setClearState(true);
      }
      setEnMove([])
    }

    move.map((item)=>{
      if(item[0]==retu && item[1]==gyo){
        setGameState(false);
      }
    })
      },[lineRow,direction,enemyGyo,enemyRetu,move,enMove])

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  const log = (data) => {
    const tag = document.createElement('p');
    tag.textContent = data;
    document.body.appendChild(tag);
  }

  // const success = useCallback((pos) => {
  //   var crd = pos.coords;
  //   if(gpsx!=0){
  //     henkou(gpsx,gpsy,crd.longitude,crd.latitude)
  //   }
  //   setGpsx(crd.longitude);
  //   setGpsy(crd.latitude);
  // },[])

  const success = useCallback((pos) => {
    var crd = pos.coords;
    gpsx.push(crd.longitude);
    gpsy.push(crd.latitude);
    setDone(true);
  },[gpsx,gpsy])


  const error = useCallback((err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  },[])

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(success, error, options);
  // }, []);

  useEffect(() => {
    if(gameState){
      const id = setInterval(()=> {
        enemyMove(direction);
        navigator.geolocation.getCurrentPosition(success, error, options);
        if(done==true){
          setDone(false);
          henkou(gpsx[0],gpsy[0],gpsx[1],gpsy[1]);   
        }
      }, 1000);

      return () => {
        clearInterval(id);
      };
    }
  }, [enemyMove,henkou,success,error,options,direction,gameState,gpsx,gpsx1,gpsy,gpsy1]);


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {clearState ? (<h1>ゲームクリア</h1>) : (gameState ?
      <table border="1" align="center">
        <tbody>
        {lineRow.map((value1,taretu) => {
          return (
          <tr key={("line" + String(taretu))}>
            {value1.map((value,tagyo) => {
              return(
                <td className = {taretu==retu && tagyo==gyo ? "color3" : (taretu==enemyRetu && tagyo==enemyGyo ? "color4" : `color${value}`)} key = {("row" + String(tagyo)) }/>
              )
            })}
          </tr>
          )
        })}
        </tbody>
      </table>
      : <h1>ゲームオーバー</h1>)}
        横{gpsx[0]}
        縦{gpsy[0]}
        {/* <input  onChange={(e) => seta(e.target.value)}/>
        <input  onChange={(e) => setb(e.target.value)}/>
        <input  onChange={(e) => setc(e.target.value)}/>
        <input  onChange={(e) => setd(e.target.value)}/>
        <button onClick={() => {gpsx.push(a); gpsy.push(b); gpsx.push(c); gpsy.push(d);}}/> */}
        <button className="ma" onClick = {() => {if (retu!=0) {setDirectionme([-1,0])}}} >↑</button>
        <button onClick = {() => {if (retu!=9) {setDirectionme([1,0])}}} >↓</button>
        <button onClick = {() => {if (gyo!=0) {setDirectionme([0,-1])}}} >←</button>
        <button onClick = {() => {if (gyo!=9) {setDirectionme([0,1])}}} >→</button>

    </>
  )
}
