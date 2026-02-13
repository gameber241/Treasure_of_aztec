import { _decorator, Component, Sprite, SpriteFrame, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundToggle')
export class SoundToggle extends Component {
    public static instance: SoundToggle
    @property(Sprite)
    icon: Sprite = null;

    @property([SpriteFrame])
    icons: SpriteFrame[] = []; // [0] = ON , [1] = OFF

    @property(AudioSource)
    bgMusic: AudioSource = null;

    @property(AudioSource)
    bigwin: AudioSource = null;

    @property(AudioSource)
    totalWIn: AudioSource = null;

    private isSound: boolean = true;

    @property(AudioClip)
    spin: AudioClip = null

    @property(AudioClip)
    button: AudioClip = null

    @property(AudioClip)
    scratchIdle: AudioClip = null


    @property(AudioClip)
    bgMusicNormal: AudioClip = null


    @property(AudioClip)
    bgMusicFreeWin: AudioClip = null

    @property(AudioClip)
    rollScratch: AudioClip = null


    @property(AudioClip)
    symbolDrop: AudioClip = null


    @property(AudioClip)
    symBolWin: AudioClip = null

    @property(AudioClip)
    changeSymbol: AudioClip = null

    @property(AudioClip)
    BustCoin: AudioClip = null

    @property(AudioClip)
    bop: AudioClip = null

    protected onLoad(): void {
        SoundToggle.instance = this
    }
    start() {
        // Lấy trạng thái đã lưu

        const saved = localStorage.getItem("bg_sound");
        if (saved !== null) {
            this.isSound = saved === "true";
        }

        this.updateState();

        this.playNormal()
    }

    btnClick() {
        this.isSound = !this.isSound;
        this.updateState();

        // Lưu lại trạng thái
        localStorage.setItem("bg_sound", this.isSound.toString());
    }

    private updateState() {

        // Đổi icon
        this.icon.spriteFrame = this.isSound ? this.icons[0] : this.icons[1];

        // Bật / tắt nhạc
        if (this.bgMusic) {
            if (this.isSound) {
                if (!this.bgMusic.playing) {
                    this.bgMusic.play();
                }
            } else {
                this.bgMusic.stop();
            }
        }
    }


    playBgMusic(audioClip) {
        if (this.isSound == false) return
        this.bgMusic.stop()
        this.bgMusic.clip = audioClip
        this.bgMusic.loop = true
        this.bgMusic.play()
    }

    public PlayOneShot(audioClip) {
        if (this.isSound == false) return

        this.bgMusic.playOneShot(audioClip, 1)
    }

    public PlaySpin() {
        this.PlayOneShot(this.spin)
    }

    PlayButton() {
        this.PlayOneShot(this.button)

    }

    PlayScatchIdle() {
        this.PlayOneShot(this.scratchIdle)
    }

    PlayRollScatch() {
        this.PlayOneShot(this.rollScratch)
    }

    playNormal() {
        this.playBgMusic(this.bgMusicNormal)

    }

    playFreewin() {
        this.playBgMusic(this.bgMusicFreeWin)

    }

    PlaySymbolDrop() {
        this.PlayOneShot(this.symbolDrop)
    }

    PlayChangeSymbol() {
        this.PlayOneShot(this.changeSymbol)
    }


    PlaySymbolWin() {
        this.PlayOneShot(this.symBolWin)
    }

    playBigWin() {
        this.bigwin.play()
    }

    stopBigwin() {
        this.bigwin.stop()

    }


    playTotalWin() {
        this.totalWIn.play()

    }

    stopTotalWIn() {
        this.totalWIn.stop()

    }

    PlayBustCoin() {
        this.PlayOneShot(this.BustCoin)
    }

    PlayRoll() {
        this.PlayOneShot(this.bop)

    }
}
