const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');
const { TextInput } = require('powercord/components/settings');
module.exports = class settings extends React.PureComponent {
  render() {
    return (
      <div>
        
        <TextInput
          value={this.props.getSetting('char')}
          onChange={e => this.props.updateSetting('char', e)}
        >
          Prefix for timestamp, leave blank for no prefix.
        </TextInput>
        <SwitchItem
          value={this.props.getSetting('t')}
          onChange={() => this.props.toggleSetting('t')}
        >
          Short Time:   16:20
        </SwitchItem>
        <SwitchItem
          value={this.props.getSetting('T')}
          onChange={() => this.props.toggleSetting('T')}
        >
          Long Time:  16:20:30
        </SwitchItem>
        <SwitchItem
          value={this.props.getSetting('d')}
          onChange={() => this.props.toggleSetting('d')}
        >
          Short Date:   20/04/2021
        </SwitchItem>
        <SwitchItem
          value={this.props.getSetting('D')}
          onChange={() => this.props.toggleSetting('D')}
        >
          Long Date:  20 April 2021
        </SwitchItem>
        <SwitchItem
          value={this.props.getSetting('f')}
          onChange={() => this.props.toggleSetting('f')}
        >
          Short Date/Time:  20 April 2021 16:20
        </SwitchItem>
        <SwitchItem
          value={this.props.getSetting('F')}
          onChange={() => this.props.toggleSetting('F')}
        >
          Long Date/Time:  Tuesday, 20 April 2021 16:20
        </SwitchItem>
        <SwitchItem
          value={this.props.getSetting('R')}
          onChange={() => this.props.toggleSetting('R')}
        >
          Relative Time:  2 months ago
        </SwitchItem>
      </div>
    );
  }
};
