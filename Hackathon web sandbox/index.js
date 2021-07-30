import React from 'react';
import AppViews from './views/AppViews';
import FunderViews from './views/FunderViews';
import SubmitterViews from './views/SubmitterViews';
import { renderDOM, renderView } from './views/render';
import './index.css'; // imprort css file
import * as backend from './build/index.main.mjs'; // backend   
import {loadStdlib} from '@reach-sh/stdlib';    

const reach = laodStdlib(process.env);
const { standartUnit } = reach;
const defaults = { defaultFundAmt: '10', defaultPrize: '3', defaultDeadline: '1000', standardUnit };

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {view: 'ConnectAccount', ...defaults}
    }

    async componentDidMount() { //connect account successfull
        const acc = await reach.getDefaultAccount();    //get account
        const balAtomic = await reach.balanceOf(acc);   //get account balance
        const bal = reach.formatCurrency(balAtomic, 4);
        this.setState({ acc, bal });
        try {
            const faucet = await reach.getFaucet();
            this.setState({ view: 'FundAccount', faucet });
        } catch (e) {
            this.setState({ view: 'FunderOrSubmitter' });
        }
    }

    // not sure is this useful for submitter
    async FundAccount(foundAmount) {    // add additional fund to account
        await reach.transfer(this.state.faucet, this.state.acc, reach.parseCurrency(fundAmount));
        this.setState({ view: 'FunderOrSubmitter' });
    }

    async skipFundAccount() {   // skip add additional fund to account
        this.setState({ view: 'FunderOrSubmitter' });
    }

    selectFunder() { this.setState({ view: 'Wrapper', ContentView: Funder }); }
    selectSubmitter() { this.setState({ view: 'Wrapper', ContentView: Submitter }); }
    render() { return renderView(this, AppViews); }
}

class Player extends React.Component {
    // NOT YET FINISHED     (NEED BACKEND)
    // FOR INTERACTION BETWEEN FUNDER AND SUBMITTER
}

class Funder extends Player {
    constructor(props) {
        super(props);
        this.setState = {view: 'SetPrizeAndDeadline'}
    }
    setPrizeAndDeadline(prize, deadline) { this.setState({ view: 'Confirm', prize, deadline }); }

    async confirm() {
        const ctc = this.props.acc.display(backend);
        this.setState({ view: 'WriteProposal' });
        proposeProposal(proposal){ this.setState({ view: 'Launching', proposal }, ctc) };
        //this.setState({ view: 'Launching' }, ctc);
        this.prize = reach.parseCurrency(this.state.prize);
        backend.Alice(ctc, this);   // backend of Funder (Alice)
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        this.setState({ view: 'WaitingForSubmitter', ctcInfoStr, deadline });
    }

    async returnToSetPrizeAndDeadline() {  // idk if this possible
        this.setState({ view: 'SetPrizeAndDeadline' });
    } 

    render() { return renderView(this, FunderViews); }
}

class Submitter extends Player {
    constructor(props) {
        super(props);
        this.setState = {view: 'Submit'}
    }
    // NOT YET FINISHED
}