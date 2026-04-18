import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    create ()
    {
        const startPreloader = () => this.scene.start('Preloader');

        if ('fonts' in document)
        {
            document.fonts.load('1em "VT323"').then(startPreloader).catch(startPreloader);

            return;
        }

        startPreloader();
    }
}
