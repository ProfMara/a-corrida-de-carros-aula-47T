class Game{
    constructor(){
        this.button = createButton("");
        
        this.leaderTitle = createElement("h2");
        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
        this.movendo = false;
    }
    handleElements(){
        this.button.position(width*0.66, 100);
        this.button.class("resetButton");
        
        //definir a posição do elemento
        this.leaderTitle.position(width*0.33,50);
        this.leaderTitle.class("resetText");
        this.leaderTitle.html("PLACAR");

        this.leader1.position(width * 0.33, 100);
        this.leader1.class("leadersText");

        this.leader2.position(width * 0.33, 150);
        this.leader2.class("leadersText");
        
        //define o que ocorre quando clica nele
        this.button.mousePressed(()=>{
            //indica a raiz do banco de dados
            database.ref("/").set({
                //escreve esses valores no banco
                gameState:0, playerCount:0,winners:0
            });
            //recarrega a página local
            window.location.reload();
        });
    }

    showLeaderBoard(){
        //MATRIZ DE OBJETOS DE JOGADORES
        var players = Object.values(allPlayers);
        var leader1, leader2;
        //situação 1: ninguém cruzou a linha de chegada
        if(players[0].rank == 0 && players[1].rank == 0){
            //primeiro leader: jogador 0
            leader1 = players[0].rank 
             + "&emsp;"
             + players[0].name 
             + "&emsp;" 
             + players[0].score;
            //segundo leader: jogador 1
            leader2 = players[1].rank 
            + "&emsp;" 
            + players[1].name 
            + "&emsp;" 
            + players[1].score;
        }
        //SITUAÇÃO B: o player 0 cruzou a linha de chegada
        if(players[0].rank == 1){
            //primeiro leader: jogador 0
            leader1 = players[0].rank 
             + "&emsp;"
             + players[0].name 
             + "&emsp;" 
             + players[0].score;
            //segundo leader: jogador 1
            leader2 = players[1].rank 
            + "&emsp;" 
            + players[1].name 
            + "&emsp;" 
            + players[1].score;
        }
        //SITUAÇÃO C: o player 1 cruzou a linha de chegada primeiro
        if(players[1].rank == 1){
            //primeiro leader: jogador 1
            leader1 = players[1].rank 
             + "&emsp;"
             + players[1].name 
             + "&emsp;" 
             + players[1].score;
            //segundo leader: jogador 0
            leader2 = players[0].rank 
            + "&emsp;" 
            + players[0].name 
            + "&emsp;" 
            + players[0].score;
        }

        this.leader1.html(leader1);
        this.leader2.html(leader2);
    }



    
    start(){
        //cria o objeto form da classe Form
        form = new Form();
        //chama o método exibir do formulário
        form.exibir();

        //cria uma instância de novo jogador
        player = new Player();
        //pega a quantidade de jogadores no bd
        player.getCount();

        //cria a sprite do carro1
        car1 = createSprite(width/2 - 100, height-100);
        car1.addImage("carro", carimg1);
        car1.scale = 0.07;

        //cria a sprite do carro2
        car2 = createSprite(width/2 + 100, height-100);
        car2.addImage("carro", carimg2);
        car2.scale = 0.07;

        //adiciona as duas sprites na matriz cars
        cars = [car1, car2];

        var obstacles1 = [
            { x: width / 2 - 150, y: height - 1300},
            { x: width / 2 + 250, y: height - 1800},
            { x: width / 2 - 180, y: height - 3300},
            { x: width / 2 - 150, y: height - 4300},
            { x: width / 2, y: height - 5300 },
            { x: width / 2 - 180, y: height - 5500}
        ];
        var obstacles2 = [
            { x: width / 2 + 250, y: height - 800},
            { x: width / 2 - 180, y: height - 2300},
            { x: width / 2, y: height - 2800},
            { x: width / 2 + 180, y: height - 3300},
            { x: width / 2 + 250, y: height - 3800},
            { x: width / 2 + 250, y: height - 4800},
        ];
        //cria grupo
        fuels = new Group ();
        obsG1 = new Group ();
        //criar o grupo obsG2

        obsG2 = new Group ();

        this.addSprites(fuels, fuelImg, 35,0.025);
        //chama o método para adicionar as sprites de obstáculo
        this.addSprites(obsG1, obsImg1, obstacles1.length, 0.04, obstacles1);
        //chamar o método para adicionar as sprites de cones
        this.addSprites(obsG2, obsImg2, obstacles2.length, 0.04, obstacles2);
    }
    
    addSprites(grupo, imagem, quantidade, tamanho, posicoes=[]){
        for(var i = 0; i < quantidade; i++){
            //checa se elementos na matriz
            if(posicoes.length>0){
                //define a posição com base na matriz
                var x = posicoes[i].x;
                var y = posicoes[i].y;
            }else{
                //define a posição de modo aleatório
                var x = random(width*0.33, width*0.66);

                var y = random(-height*4.5, height-100);
            }

            var sprite = createSprite(x,y);
            sprite.addImage(imagem);
            sprite.scale = tamanho;
            grupo.add(sprite);
        }
    }

    handleFuel(i){
        cars[i-1].overlap( fuels, function(colisor, collected){
            collected.remove();
            player.fuel = 160;
        } )
        if(this.movendo){
            player.fuel--;
            this.movendo = false;
        }
        if(player.fuel<=0){
            this.gameOver();
        }
    }

 

    //mostrar o combustível
    showFuel(){
        //atualizar as configurações
        push ();
        image (fuelImg, player.positionX - 130,height - player.positionY - 100,20,20)
        //pintar de branco
        fill ("white");
        //colocar um retângulo
        rect (player.positionX - 100,height - player.positionY - 100,160,20);
        //pintar de laranja
        fill ("orange");
        //colocar a barra do combustível
        rect (player.positionX - 100,height - player.positionY - 100, player.fuel ,20);
        //voltar pra config antiga
        pop ()
    }
    //mostrar a vida
    showLife(){
        //atualizar as configurações
        push ();
        image (lifeImg, player.positionX - 130,height - player.positionY - 130,20,20)
        //pintar de branco
        fill ("white");
        //colocar um retângulo
        rect (player.positionX - 100,height - player.positionY - 130,160,20);
        //pintar de vermelho
        fill ("red");
        //colocar a barra do combustível
        rect (player.positionX - 100,height - player.positionY - 130, player.life ,20);
        //voltar pra config antiga
        pop ()
    }



    play(){
        form.esconder();
        Player.getInfo();
        this.handleElements();
        //checar se allPlayers tem valor
        if(allPlayers !== undefined){
            this.showLeaderBoard();
           
            player.getWinners();
            //colocar a imagem da pista
            image (pista, 0, -height*5 , width, height*6);
            this.showFuel();
            //mostrar a barra de vida
            this.showLife();
           
            //guardar o indice da sprite do carro
            var i = 0;
            //repetir os códigos pelo número de props do objeto
            for(var plr in allPlayers){
                //guarda do banco de dados o valor x
                var x = allPlayers[plr].posX;
                //guarda do banco de dados o valor y
                var y = height - allPlayers[plr].posY;
                //muda a posição da sprite do carro
                cars[i].position.x = x;
                cars[i].position.y = y;
                //aumenta o i para handleElements o outro carro
                i++;
                //checa se o valor de i é igual ao índice do jogador
                if( i == player.index ){
                    this.handleFuel(i)
                    //lidar com a colisão
                   
                    //a câmera segue o jogador
                    camera.position.y = y;

                    var linhaChegada = height*6;
                    //checa se o player passou da linha
                    if(player.positionY > linhaChegada){
                       //aumenta o valor do rank do jogador
                        player.rank++;
                        Player.updateWinners(player.rank);
                        gameState = 2;
                        this.showRank();
                    }
                }

            }
            //chamar o método controlar carro
            this.controlarCarro();
            //desenhar as sprites
            drawSprites();
        }
    }

    controlarCarro(){
        if(keyDown(UP_ARROW)){
            player.positionY += 10;
            player.update();
            this.movendo = true;
        }
        if(keyDown(LEFT_ARROW) && player.positionX > width*0.33){
            player.positionX -= 10;
            player.update();
        }
        if(keyDown(RIGHT_ARROW) && player.positionX < width*0.66){
            player.positionX += 10;
            player.update();
        }
    }

    //lê no banco de dados e copia o valor de gameState
    getState(){
        database.ref("gameState").on("value", function(data){
            gameState = data.val();
        })
    }

    //atualiza o valor de gameState 
    update(state){
        database.ref("/").update({
            gameState:state,
        })
    }
   
    showRank(){
        //gera o alerta doce
        //sweet alert 
        swal({
            //titulo
            title:"INCRÍVEL "+player.rank+" º LUGAR!" ,
            //texto
            text:"Você ultrapassou a linha de chegada!",
            //o endereço da imagem
            imageUrl:"https://media.tenor.com/sZAFBih2R54AAAAC/minions.gif",
            //o tamanho dela
            imageSize:'300x300',
            //texto do botãozinho
            confirmButtonText:"Ok"
        })
    }

    gameOver(){
        swal({
            //titulo
            title:"Que pena "+player.name+"😥!" ,
            //texto
            text:"Você perdeu seu combustivel!",
            //o endereço da imagem
            imageUrl:"https://media.tenor.com/bAPQ2tejx6YAAAAd/crying-minions.gif",
            //o tamanho dela
            imageSize:'300x300',
            //texto do botãozinho
            confirmButtonText:"Ok"
        })
        gameState = 2;
    }
   
}   
